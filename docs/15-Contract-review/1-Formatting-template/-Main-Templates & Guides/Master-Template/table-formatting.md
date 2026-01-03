# Table Formatting - `table-layout: fixed` Test

Testing `table-layout: fixed` with `width: 100%` to force column widths.

---

## Test 1: With `table-layout: fixed` (20% - 80%)

Both columns have identical content, but Column 1 should be 20%, Column 2 should be 80%.

<table style="table-layout: fixed; width: 100%;">
  <colgroup>
    <col style="width: 20%">
    <col style="width: 80%">
  </colgroup>
  <thead>
    <tr>
      <th>Column 1 (20%)</th>
      <th>Column 2 (80%)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>subject-photo</code></td>
      <td><code>subject-photo</code></td>
    </tr>
    <tr>
      <td><code>subject-photo-1</code></td>
      <td><code>subject-photo-1</code></td>
    </tr>
    <tr>
      <td><code>img-map-regional</code></td>
      <td><code>img-map-regional</code></td>
    </tr>
  </tbody>
</table>

---

## Test 2: With `table-layout: fixed` (80% - 20%)

Same content, reversed widths. Column 1 should be 80%, Column 2 should be 20%.

<table style="table-layout: fixed; width: 100%;">
  <colgroup>
    <col style="width: 80%">
    <col style="width: 20%">
  </colgroup>
  <thead>
    <tr>
      <th>Column 1 (80%)</th>
      <th>Column 2 (20%)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>subject-photo</code></td>
      <td><code>subject-photo</code></td>
    </tr>
    <tr>
      <td><code>subject-photo-1</code></td>
      <td><code>subject-photo-1</code></td>
    </tr>
    <tr>
      <td><code>img-map-regional</code></td>
      <td><code>img-map-regional</code></td>
    </tr>
  </tbody>
</table>

---

## Test 3: With `table-layout: fixed` (3 columns - 15% / 35% / 50%)

<table style="table-layout: fixed; width: 100%;">
  <colgroup>
    <col style="width: 15%">
    <col style="width: 35%">
    <col style="width: 50%">
  </colgroup>
  <thead>
    <tr>
      <th>Prefix (15%)</th>
      <th>Category (35%)</th>
      <th>Examples (50%)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>subject-</code></td>
      <td>Subject property attributes</td>
      <td><code>subject-street</code>, <code>subject-nra</code>, <code>subject-units</code></td>
    </tr>
    <tr>
      <td><code>comp1-</code> to <code>comp5-</code></td>
      <td>Sales comparables</td>
      <td><code>comp1-sale-price</code>, <code>comp3-address</code></td>
    </tr>
    <tr>
      <td><code>rentcomp1-</code> to <code>rentcomp5-</code></td>
      <td>Rental comparables</td>
      <td><code>rentcomp1-rent-unit-avg</code></td>
    </tr>
    <tr>
      <td><code>calc-</code></td>
      <td>Calculated outputs</td>
      <td><code>calc-noi</code>, <code>calc-egr</code>, <code>calc-cap-rate</code></td>
    </tr>
    <tr>
      <td><code>ia-dircap-</code></td>
      <td>Income Approach - Direct Cap</td>
      <td><code>ia-dircap-noi</code>, <code>ia-dircap-value</code></td>
    </tr>
  </tbody>
</table>

---

## Test 4: With `table-layout: fixed` (4 columns - 20% / 20% / 20% / 40%)

<table style="table-layout: fixed; width: 100%;">
  <colgroup>
    <col style="width: 20%">
    <col style="width: 20%">
    <col style="width: 20%">
    <col style="width: 40%">
  </colgroup>
  <thead>
    <tr>
      <th>Field ID (20%)</th>
      <th>Valcre ID (20%)</th>
      <th>Registry (20%)</th>
      <th>Description (40%)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>subject-photo</code></td>
      <td><code>Subject_Photo</code></td>
      <td>✅</td>
      <td>Cover photo</td>
    </tr>
    <tr>
      <td><code>subject-photo-1</code></td>
      <td><code>DASHBOARD-IMAGE</code></td>
      <td>✅</td>
      <td>Subject photo 1</td>
    </tr>
    <tr>
      <td><code>img-map-regional</code></td>
      <td><code>Map_Regional</code></td>
      <td>✅</td>
      <td>Regional location map</td>
    </tr>
    <tr>
      <td><code>img-map-local</code></td>
      <td><code>Map_Local</code></td>
      <td>✅</td>
      <td>Local area map</td>
    </tr>
  </tbody>
</table>

