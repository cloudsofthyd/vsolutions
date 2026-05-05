# ============================================================
# Route 53 — hosted zone + apex/www A records aliased to the ALB.
# Validation CNAMEs for ACM are created in alb_acm.tf.
# Nameservers from this zone must be set in GoDaddy (Phase 4).
# ============================================================

resource "aws_route53_zone" "main" {
  name = var.domain_name

  tags = { Name = "${local.name_prefix}-zone" }
}

resource "aws_route53_record" "apex_a" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "www_a" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}

# IPv6 (AAAA) — best practice; ALB has dualstack DNS
resource "aws_route53_record" "apex_aaaa" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "AAAA"

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "www_aaaa" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.${var.domain_name}"
  type    = "AAAA"

  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}

# ============================================================
# Microsoft 365 / Outlook — mail routing for vsolutionsinc.com
# Standard Exchange Online records:
#   MX        → tenant inbox
#   SPF       → authorize Microsoft to send on behalf of the domain
#   Autodiscover CNAME → Outlook clients find the right server
#   DMARC     → reporting/policy on email auth failures
# DKIM CNAMEs require the M365 tenant's <tenant>.onmicrosoft.com value;
# they're commented below — fill in once you grab it from M365 admin.
# ============================================================

# MX — for Exchange Online, the standard target is "<domain-with-hyphens>.mail.protection.outlook.com"
resource "aws_route53_record" "mx_apex" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "MX"
  ttl     = 3600
  records = ["0 vsolutionsinc-com.mail.protection.outlook.com."]
}

# Apex TXT — multiple values colocated:
#   1. SPF (authorizes Microsoft 365 to send)
#   2. Google Search Console domain verification
#   3. Bing webmaster verification (add when token provided)
# A domain may have one TXT record-set per name; multiple values are stored as
# separate strings in `records` — DNS returns all when queried.
resource "aws_route53_record" "txt_spf" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "TXT"
  ttl     = 3600
  records = [
    "v=spf1 include:spf.protection.outlook.com -all",
    "google-site-verification=U0as-W6E9LIbHATiNsn66zozKlzQqBqkgfQ46LN7ys8",
  ]
}

# Autodiscover — Outlook desktop / mobile clients use this to auto-configure
resource "aws_route53_record" "autodiscover" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "autodiscover.${var.domain_name}"
  type    = "CNAME"
  ttl     = 3600
  records = ["autodiscover.outlook.com."]
}

# DMARC — start with "p=none" for monitoring, ramp to "p=quarantine" then "p=reject"
# once you confirm legitimate senders pass SPF/DKIM (check the rua= reports first).
resource "aws_route53_record" "txt_dmarc" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "_dmarc.${var.domain_name}"
  type    = "TXT"
  ttl     = 3600
  records = ["v=DMARC1; p=none; rua=mailto:dmarc@${var.domain_name}; ruf=mailto:dmarc@${var.domain_name}; fo=1"]
}

# ============================================================
# Resend (transactional outbound — contact-form notifications only).
# Apex M365 records are unaffected:
#   - DKIM at "resend._domainkey" (apex selector, different from M365's selector1/2)
#   - Bounce/return-path on "send.<domain>" subdomain (separate SPF/MX scope)
# ============================================================

# Bing Webmaster Tools — domain ownership verification (CNAME)
resource "aws_route53_record" "bing_verification" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "18cad360d4e282dafcaf4baac1620020.${var.domain_name}"
  type    = "CNAME"
  ttl     = 3600
  records = ["verify.bing.com."]
}

resource "aws_route53_record" "resend_dkim" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "resend._domainkey.${var.domain_name}"
  type    = "TXT"
  ttl     = 3600
  records = ["p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7QPR/R5LI+A9HwYrvD7AVuviQEN+WX+G8sAXgZ/Rj5MTuBn6mPCt6/LAzm0RtVnM2FWpUst7XntWQY0Xpdl1KY2BfcOuOhQ//MwB1acBRitKbPdDuwf+0Ec7rh3M2kB/cTzJvCK6qaEUGQ2gVxMZXmofkn3rRlIO8JrArlau+WQIDAQAB"]
}

resource "aws_route53_record" "resend_mx_send" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "send.${var.domain_name}"
  type    = "MX"
  ttl     = 3600
  records = ["10 feedback-smtp.us-east-1.amazonses.com."]
}

resource "aws_route53_record" "resend_spf_send" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "send.${var.domain_name}"
  type    = "TXT"
  ttl     = 3600
  records = ["v=spf1 include:amazonses.com ~all"]
}

# ───── DKIM (uncomment + fill <tenant> after M365 enables DKIM signing) ─────
# resource "aws_route53_record" "dkim_selector1" {
#   zone_id = aws_route53_zone.main.zone_id
#   name    = "selector1._domainkey.${var.domain_name}"
#   type    = "CNAME"
#   ttl     = 3600
#   records = ["selector1-vsolutionsinc-com._domainkey.<tenant>.onmicrosoft.com."]
# }
# resource "aws_route53_record" "dkim_selector2" {
#   zone_id = aws_route53_zone.main.zone_id
#   name    = "selector2._domainkey.${var.domain_name}"
#   type    = "CNAME"
#   ttl     = 3600
#   records = ["selector2-vsolutionsinc-com._domainkey.<tenant>.onmicrosoft.com."]
# }

# ───── Skype/Teams (optional — uncomment if you use Teams calling) ──────────
# resource "aws_route53_record" "sip_cname" {
#   zone_id = aws_route53_zone.main.zone_id
#   name    = "sip.${var.domain_name}"
#   type    = "CNAME"
#   ttl     = 3600
#   records = ["sipdir.online.lync.com."]
# }
# resource "aws_route53_record" "lyncdiscover" {
#   zone_id = aws_route53_zone.main.zone_id
#   name    = "lyncdiscover.${var.domain_name}"
#   type    = "CNAME"
#   ttl     = 3600
#   records = ["webdir.online.lync.com."]
# }
# resource "aws_route53_record" "sip_srv" {
#   zone_id = aws_route53_zone.main.zone_id
#   name    = "_sip._tls.${var.domain_name}"
#   type    = "SRV"
#   ttl     = 3600
#   records = ["100 1 443 sipdir.online.lync.com."]
# }
# resource "aws_route53_record" "sipfederation_srv" {
#   zone_id = aws_route53_zone.main.zone_id
#   name    = "_sipfederationtls._tcp.${var.domain_name}"
#   type    = "SRV"
#   ttl     = 3600
#   records = ["100 1 5061 sipfed.online.lync.com."]
# }
