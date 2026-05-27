# Amaneka Assurance - Full Application Build Prompt

## Project Overview

Build a modern AI-powered insurance management platform called **Amana Assurance** focused on automobile insurance and accident claim management.

The application must provide a complete digital workflow from insurance subscription to accident declaration, expert validation, repair tracking, and smart risk evaluation.

The platform should be scalable, production-ready, mobile-first, secure, and designed for real insurance companies and customers.

---

# Main Goal

Replace traditional insurance bureaucracy with a fully digital ecosystem.

The application should:

* simplify insurance subscription,
* automate claim processing,
* reduce fraud,
* improve customer experience,
* integrate AI features,
* connect insurance companies, experts, towing services, and repair garages.

---

# User Roles

## 1. Customer

Can:

* create account,
* request insurance,
* upload documents,
* simulate prices,
* declare accidents,
* upload accident photos,
* track repair progress,
* receive PDF contracts.

---

## 2. Insurance Company Admin

Can:

* validate contracts,
* manage customers,
* manage experts,
* review claims,
* manage pricing rules,
* approve/reject requests.

---

## 3. Regional Expert

Can:

* review accident declarations,
* analyze photos,
* schedule inspections,
* validate damages,
* estimate repair costs,
* assign partner garages.

---

## 4. Garage Partner

Can:

* receive repair requests,
* update repair status,
* upload repair progress,
* notify completion.

---

## 5. Towing Service Partner

Can:

* receive dépannage requests,
* accept/reject missions,
* track towing operations.

---

# Core Features

# PART 1 - Insurance Subscription System

## Authentication

Build:

* Login
* Signup
* Forgot password
* OTP verification
* JWT authentication
* Role-based access control

Support:

* Email authentication
* Phone authentication
* Google login

---

## Dashboard

Customer dashboard should display:

* Active contracts
* Pending requests
* Claims history
* Notifications
* Payment history
* Insurance status

Admin dashboard should display:

* Total customers
* Claims statistics
* Pending validations
* Revenue analytics
* Fraud alerts

---

## Insurance Creation Workflow

### Step 1 - Select Insurance Type

Available options:

* Third-party insurance
* Full coverage insurance
* Commercial vehicle insurance

---

### Step 2 - Select Insurance Partner

Examples:

* SAA
* CAAT
* CASH Assurance

Display:

* company info,
* pricing,
* coverage details,
* ratings.

---

### Step 3 - Vehicle Information

Collect:

* vehicle brand,
* model,
* year,
* registration number,
* fuel type,
* mileage,
* engine power.

---

### Step 4 - Driver Information

Collect:

* full name,
* national ID,
* driving license,
* address,
* phone number,
* driving experience.

---

### Step 5 - Document Upload

Allow upload of:

* ID card,
* driving license,
* vehicle registration card.

Features:

* OCR extraction,
* automatic validation,
* image compression,
* fraud detection.

---

### Step 6 - Mileage Declaration

Collect:

* annual mileage,
* monthly mileage,
* average daily usage.

Use data for:

* dynamic risk scoring,
* insurance pricing.

---

### Step 7 - AI Risk Evaluation

Implement AI model to predict:

* accident probability,
* fraud risk,
* risk score,
* recommended pricing.

Factors:

* age,
* vehicle type,
* driving history,
* mileage,
* region,
* accident history.

---

### Step 8 - Price Simulation

Display:

* estimated insurance price,
* taxes,
* discounts,
* monthly installment options,
* yearly payment options.

---

### Step 9 - Payment System

Integrate:

* bank cards,
* Edahabia,
* CIB,
* Stripe,
* PayPal.

Generate:

* invoices,
* payment confirmations.

---

### Step 10 - Contract Generation

Generate PDF contract with:

* QR Code,
* contract number,
* customer information,
* policy details,
* expiration date.

QR code should verify contract authenticity.

---

# PART 2 - Accident / Claim Management

## Accident Declaration

### Step 1 - Start Declaration

Customer clicks:
"Declare Accident"

Capture:

* date,
* time,
* location,
* weather conditions.

Use:

* GPS location,
* map integration.

---

### Step 2 - Emergency Assistance

Ask:
"Do you need towing service?"

If yes:

* detect nearest towing partner,
* send real-time request,
* track towing vehicle.

---

### Step 3 - Accident Photo Upload

Allow upload of:

* vehicle damage photos,
* accident scene photos,
* documents.

Features:

* AI damage detection,
* fraud analysis,
* duplicate image detection,
* automatic quality verification.

---

### Step 4 - Digital Constat Form

Include:

* accident description,
* responsible side,
* witnesses,
* second vehicle information,
* police report,
* driver statements.

Support:

* digital signature,
* sketch drawing system.

---

### Step 5 - Expert Assignment

Automatically assign regional expert based on:

* location,
* workload,
* expertise.

Send:

* accident data,
* images,
* customer details.

---

### Step 6 - Inspection Scheduling

Allow:

* customer appointment booking,
* home inspection,
* accident location inspection.

Provide:

* calendar system,
* notifications,
* reminders.

---

### Step 7 - Damage Evaluation

Expert can:

* estimate repair costs,
* identify damaged parts,
* approve/reject claim,
* determine compensation.

Use AI assistance for:

* damage estimation,
* severity prediction.

---

### Step 8 - Garage Assignment

Assign nearest partner garage.

Garage receives:

* repair order,
* estimated budget,
* replacement parts list.

---

### Step 9 - Repair Tracking

Customer can track:

* waiting inspection,
* parts ordered,
* repair in progress,
* completed repair.

Include:

* progress timeline,
* estimated completion date,
* notifications.

---

# AI FEATURES

Implement advanced AI modules:

## 1. Risk Score Prediction

Predict insurance risk score using machine learning.

---

## 2. Fraud Detection

Detect:

* fake accidents,
* duplicate claims,
* manipulated images,
* suspicious patterns.

---

## 3. Damage Detection

Use computer vision to:

* detect damaged vehicle parts,
* estimate repair cost,
* classify damage severity.

---

## 4. OCR System

Extract information automatically from:

* ID cards,
* licenses,
* vehicle documents.

---

# Technical Requirements

# Frontend

Use:

* Flutter or React Native for mobile app
* React.js or Next.js for admin dashboard

Requirements:

* responsive UI,
* dark mode,
* multilingual support,
* Arabic + French + English,
* smooth animations,
* offline support.

---

# Backend

Use:

* Node.js + Express
  or
* Django + DRF

Requirements:

* REST API,
* secure authentication,
* scalable architecture,
* microservices-ready design.

---

# Database

Use:

* PostgreSQL

Additional:

* Redis caching,
* Elasticsearch for search.

---

# Cloud & Storage

Use:

* AWS S3 or Cloudinary for image storage,
* Firebase notifications,
* Docker deployment.

---

# Security Requirements

Implement:

* JWT authentication,
* role permissions,
* encrypted data,
* secure file upload,
* anti-fraud mechanisms,
* audit logs,
* GDPR compliance.

---

# Notification System

Support:

* push notifications,
* email notifications,
* SMS alerts.

Notify users for:

* contract approval,
* payment confirmation,
* inspection date,
* repair updates.

---

# Analytics Dashboard

Admin analytics should include:

* claims statistics,
* customer growth,
* fraud reports,
* revenue charts,
* accident heatmaps.

---

# UI/UX Requirements

Design style:

* modern fintech + insurtech design,
* clean minimal interface,
* premium appearance,
* easy navigation,
* mobile-first experience.

Colors:

* trust-based palette,
* blue,
* white,
* emerald accents.

---

# Additional Smart Features

Optional advanced features:

* chatbot assistant,
* voice accident declaration,
* real-time expert video inspection,
* AI insurance recommendation,
* blockchain contract verification.

---

# Deliverables

Build:

* mobile application,
* admin dashboard,
* backend API,
* database schema,
* AI modules,
* deployment configuration,
* documentation.

Provide:

* clean architecture,
* production-ready code,
* scalable structure,
* API documentation,
* testing strategy.

---

# Expected Outcome

A complete digital insurance ecosystem that modernizes automobile insurance operations and simplifies accident claim management using AI and automation.

The platform must feel enterprise-grade, scalable, secure, and startup-ready.
