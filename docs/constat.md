إذا كنت تبني **e-Constat Amiable d’Accident Automobile** داخل تطبيق Amana Assurance، فلا تنقل الورقة كما هي إلى شاشة واحدة. هذا خطأ تصميمي يقع فيه كثير من المطورين ثم يكتشفون أن المستخدم يترك العملية في منتصف الطريق لأن الاستمارة أصبحت أطول من عقد بيع منزل.

قسّمها إلى **Wizard Multi-Step Form** كما يلي:

---

# Step 1: Informations de l'accident

### معلومات الحادث

| Field                   | Type           |
| ----------------------- | -------------- |
| Date de l'accident      | Date Picker    |
| Heure                   | Time Picker    |
| Lieu précis             | Text           |
| Dégâts matériels autres | Textarea       |
| Présence de témoins     | Switch         |
| Nom témoin              | Text           |
| Adresse témoin          | Text           |
| Témoin du véhicule      | Select (A / B) |

---

# Step 2: Véhicule A

### Informations véhicule

| Field                    |
| ------------------------ |
| Marque                   |
| Type                     |
| Numéro d'immatriculation |
| Provenance               |
| Destination              |

### Assuré

| Field                  |
| ---------------------- |
| Nom                    |
| Prénom                 |
| Adresse                |
| Société assurance      |
| N° Police              |
| Attestation valable du |
| Attestation valable au |
| Agence                 |

### Conducteur

| Field             |
| ----------------- |
| Nom               |
| Prénom            |
| Adresse           |
| N° Permis         |
| Date délivrance   |
| Wilaya délivrance |
| Catégorie permis  |

### Dégâts

| Field                 |
| --------------------- |
| Point de choc initial |
| Dégâts apparents      |
| Observations          |

---

# Step 3: Véhicule B

نفس معلومات Véhicule A بالضبط.

---

# Step 4: Circonstances de l'accident

اعرضها كـ Checkboxes.

```text
□ Heurtait à l'arrière
□ Même sens, même file
□ Même sens, file différente
□ Sens inverse
□ Provenait d'une autre chaussée
□ Venait de droite
□ S'engageait dans un giratoire
□ Circulait dans un giratoire
□ Stationné
□ Quittait un stationnement
□ Prenait un stationnement
□ Reculait
□ Doublait
□ Dépassement irrégulier
□ Changeait de file
□ Virait à droite
□ Virait à gauche
□ Entrait dans un parking
□ Sortait d'un parking
□ Empiétait sur la voie inverse
□ Sens interdit
□ Non-respect de priorité
□ Demi-tour
□ Ouvrait une portière
```

---

# Step 5: Croquis de l'accident

هذا أهم جزء في النسخة الإلكترونية.

بدلاً من رفع صورة فقط:

### Option 1

Canvas Drawing

* Ajouter Véhicule A
* Ajouter Véhicule B
* Dessiner routes
* Ajouter flèches
* Positionner les véhicules

### Option 2

رفع صورة من الهاتف.

---

# Step 6: Informations complémentaires

### Déclaration

| Field      |
| ---------- |
| Nom assuré |
| Profession |
| Téléphone  |

### Procès verbal

| Field                  |
| ---------------------- |
| PV Gendarmerie ?       |
| Rapport Police ?       |
| Brigade / Commissariat |

### Conducteur habituel

| Field                  |
| ---------------------- |
| Conducteur habituel ?  |
| Réside chez l'assuré ? |
| Date naissance         |

---

# Step 7: Véhicule assuré

| Field                |
| -------------------- |
| Lieu habituel garage |
| Motif du déplacement |
| Lieu expertise       |
| Date expertise       |
| Téléphone contact    |

### Informations supplémentaires

| Field                    |
| ------------------------ |
| Véhicule volé ?          |
| Numéro série             |
| Véhicule gagé ?          |
| Organisme crédit         |
| Poids total en charge    |
| Véhicule attelé ?        |
| Immatriculation remorque |
| Assurance remorque       |
| Police remorque          |

---

# Step 8: Blessés

يمكن أن يكون Dynamic List.

لكل مصاب:

| Field                      |
| -------------------------- |
| Nom                        |
| Prénom                     |
| Age                        |
| Adresse                    |
| Profession                 |
| Sécurité sociale           |
| Nature blessures           |
| Gravité                    |
| Situation (Piéton / A / B) |
| Soins / Hôpital            |

زر:

```text
+ Ajouter un blessé
```

---

# Step 9: Signature électronique

### Conducteur A

* Signature Canvas

### Conducteur B

* Signature Canvas

### Assuré

* Signature Canvas

---

# JSON Structure المقترحة

```json
{
  "accident": {},
  "vehicleA": {},
  "vehicleB": {},
  "circumstances": [],
  "sketch": {},
  "insuredDeclaration": {},
  "vehicleDetails": {},
  "injuries": [],
  "signatures": {
    "driverA": "",
    "driverB": "",
    "insured": ""
  }
}
```

في مشروع Amana، الأفضل إضافة خطوة أخيرة:

**Review & Validation**

* عرض جميع البيانات.
* توليد PDF مطابق للنسخة الورقية الرسمية.
* إرسال الملف لشركة التأمين.
* إنشاء Claim Number تلقائياً.

