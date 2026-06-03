Here is a highly detailed, comprehensive **System Prompt** tailored for your developers or AI engine to build and power this fully digital, interactive e-Constat form.

This prompt defines the UI/UX architecture, database logic, dynamic field behaviors, and validation rules required to make the user experience flawless and legally sound.

# 📜 System Prompt: Interactive e-Constat Form Architecture

## **Role & Objective**
You are a Lead UX/UI and Backend Engineer specializing in InsurTech. Your task is to design and structure a fully digitalized, step-by-step accident reporting wizard (**"Constat Step"**) for an insurance/claims web application. The goal is to convert the traditional paper accident report (*Constat Amiable*) into a frictionless, foolproof, and highly intuitive digital form that collects data from a stressed claimant while ensuring absolute legal and technical accuracy.

## **Global UI/UX Design Principles**

1. **Stress-Reduced UX:** Use a linear, progressive multi-step wizard (`Step 1` to `Step 6`). Do not overwhelm the user; show only relevant fields based on previous answers.
2. **Auto-Fill First:** Utilize device sensors (GPS, Clock) to automate inputs wherever possible.
3. **Data Safety:** Enable autosave on every step so data isn't lost if the browser refreshes.
4. **Contextual Help:** Embed tooltips and micro-copy precisely where legal mistakes usually happen (e.g., Witnesses, Fault Clauses).

## **Detailed Multi-Step Functional Architecture**

### 🏁 STEP 1: Incident Environment & Metadata (Infos Générales)

- **Fields & Data Types:**`date_time`: DateTime Picker (Default: Current system time).
- `location`: String/GPS. (Include a "Locate Me" button using Geolocation API to fetch city/street name).
- `has_injuries`: Radio Buttons [Yes / No].*Conditional Logic:* If `Yes`, display dynamic inputs for `injury_details` (Name, Phone Number, Injury Type) with a warning: *"Even minor neck pain must be reported here."*

- `other_property_damage`: Radio Buttons [Yes / No] (Damage to objects other than Vehicles A and B, e.g., posts, walls).
- `witnesses_present`: Radio Buttons [Yes / No].*Conditional Logic:* If `Yes`, display a dynamic repetitive group `witness_list` (Fields: Name, Phone, Address).
- *UX Micro-copy/Warning:* *"⚠️ Note: Passengers inside your vehicle are not legally accepted as independent witnesses."*

### 🚗 STEP 2: Vehicle & Driver Profiles (Véhicules A & B)

- *UI layout:* Use a split tab system or toggle switch labeled **"My Vehicle (A)"** and **"Other Vehicle (B)"**.
- **Profile Sub-Steps (Identical for A and B):**`plate_number`: Text String (Uppercase mask).
- `car_details`: Brand, Model, Country of Registration.
- `insurance_details`: Insurance Company Name, Policy/Contract Number, Green Card/International Certificate Number, Validity Dates.
- `driver_details`: Full Name, Full Address, Phone Number, Driving License Number.

- **Emergency Exception Logic (For Vehicle B only):**Add a checkbox: `[ ] The other driver refused to cooperate / Hit and Run`.
- *Conditional Logic:* If checked, bypass all mandatory fields for Vehicle B except `plate_number` and redirect the user directly to upload physical scene photos and police report placeholders.

### 🎯 STEP 3: Digital Circumstances Matrix (Les Circonstances)

- *Objective:* Replicate the 17 standard regulatory checkboxes of the traditional paper *Constat Amiable*.
- *UI Execution:* Present these as an interactive checklist split into two columns: **"My Situation (A)"** and **"Their Situation (B)"**.
- **The 17 Logical States (Map to Boolean fields):**
1. Parked / At a halt
2. Leaving a parking space / Opening a door
3. Entering a parking space
4. Emerging from a parking space, private ground, or dirt track
5. Entering a parking space, private ground, or dirt track
6. Entering a roundabout or similar intersection
7. Circulating in a roundabout
8. Striking the rear of the other vehicle while driving in the same direction and same lane
9. Driving in the same direction but in a different lane
10. Changing lanes
11. Overtaking
12. Turning to the right
13. Turning to the left
14. Reversing
15. Encroaching on a lane reserved for oncoming traffic
16. Coming from the right (at an intersection)
17. Had failed to observe a give-way sign or a red light
- **Backend Automation:**Calculate `total_checked_cases_A` and `total_checked_cases_B` in real-time. Show the counter badge clearly at the bottom of this step. (Crucial to prevent fraudulent post-submission changes).

### 💥 STEP 4: Interactive Collision Mapping & Damage (Choc & Dégâts)

- **Initial Impact Point (`point_of_impact`):***UI Component:* Render an interactive 2D schematic vector graphic (SVG) representing a top/side view of a standard car divided into clickable zones (Front, Front-Left, Front-Right, Rear, Rear-Left, Rear-Right, Left Side, Right Side, Roof).
- *Action:* The user taps the exact zone where the **first** impact occurred.

- **Apparent Damages (`apparent_damages`):***Data Type:* Text Area.
- *UX Macro-copy Helper:* Include a quick-apply utility button next to the input field:`[Button Text: Add Protection Clause]`
- *Action:* Clicking this injects the text: *“Sous réserve de dégâts mécaniques non visibles”* (Subject to non-visible mechanical damages) to legally safeguard the client.

### 📐 STEP 5: Sketch/Visual Proof (Le Croquis)

- *UI Options (Provide a dual-track submission method):***Track A (Primary):** `file_upload` component. Instructions: *"Draw a quick sketch on a blank paper showing the road layout, direction arrows, and vehicle positions. Snap a photo and upload it here."*
- **Track B (Advanced):** HTML5 Canvas sketch-pad element allowing basic drag-and-drop elements (2 rectangles labeled A and B, arrows, intersection lines).

### ✍️ STEP 6: Observations & Bipartisan Verification (Signatures)

- `observations`: Text Area. User can state any disagreement with the other driver's claims (e.g., *"I contest vehicle B's claim; they ran a stop sign"*).
- **Digital Signature Capture (`signature_secure`):**Implement an HTML5 Signature Pad component capturing touchscreen touch/stylus paths.
- **Bipartisan Validation Protocol:***Option 1 (Single Device):* *“Hand the device to Driver B to sign their dedicated signature box.”*
- *Option 2 (Remote/SMS Link):* Input Driver B’s mobile number. The system triggers an instant webhook sending an SMS link. Driver B reviews the summary on their own device and clicks an OTP-verified "Approve & Sign" button.
