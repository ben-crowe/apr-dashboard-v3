# HOUSKI API - CORRECT USAGE

## YOU'RE USING THE WRONG ENDPOINT!

### ❌ WRONG: `/search` endpoint (what you're using)
- Limited fields
- Basic search only

### ✅ RIGHT: `/properties` endpoint (what you SHOULD use)
- 200+ fields available
- Comprehensive property data

## CORRECT API CALL

```bash
# For 1510 8th Street East, Saskatoon, SK
curl -X GET "https://api.houski.ca/properties?api_key=e081b601-58f5-4b03-858a-7584874089e0&address=1510-8th-street-east&city=saskatoon&province_abbreviation=sk&country_abbreviation=ca"
```

## IF YOU WANT ALL FIELDS

**DON'T use select parameter** - it limits what you get!

Try this for maximum data:
```bash
curl -X GET "https://api.houski.ca/properties?api_key=e081b601-58f5-4b03-858a-7584874089e0&address=1510-8th-street-east&city=saskatoon&province_abbreviation=sk&country_abbreviation=ca&expand=all"
```

## PARAMETERS TO USE

- `api_key`: e081b601-58f5-4b03-858a-7584874089e0
- `address`: Use hyphens instead of spaces (1510-8th-street-east)
- `city`: saskatoon
- `province_abbreviation`: sk (not "SK" or "Saskatchewan")
- `country_abbreviation`: ca
- `expand`: Use this to get MORE data, not select!

## AVAILABLE FIELDS (from /properties endpoint)

The `/properties` endpoint returns 200+ fields including:
- Building square footage
- Number of units/bedrooms/bathrooms  
- Zoning information
- Tax assessments and values
- Property type and characteristics
- Year built and renovation history
- Parking information
- And much more...

## TEST THIS NOW

```bash
# Test with Avenue Living property
curl -X GET "https://api.houski.ca/properties?api_key=e081b601-58f5-4b03-858a-7584874089e0&address=1510-8th-street-east&city=saskatoon&province_abbreviation=sk&country_abbreviation=ca" | python -m json.tool
```

Show me the FULL response - it should have way more than 3 fields!