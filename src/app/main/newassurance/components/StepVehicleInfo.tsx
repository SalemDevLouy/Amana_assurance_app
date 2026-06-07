"use client";

import React, { useState } from "react";
import { CarInfo } from "../types";

// ── Shared field primitives ───────────────────────────────────────────────────

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600">
        {label}{required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400";

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />;
}

function NumericInput({ value, onChange, placeholder, min = 0 }: { value: string; onChange: (v: string) => void; placeholder?: string; min?: number }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      placeholder={placeholder}
      className={inputCls}
      onChange={(e) => {
        const cleaned = e.target.value.replace(/[^0-9]/g, "");
        if (min !== undefined && cleaned !== "" && Number(cleaned) < min) return;
        onChange(cleaned);
      }}
    />
  );
}

function SelectInput({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls} appearance-none`}>
      <option value="">{placeholder ?? "Sélectionner..."}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

type UploadedFile = {
  file: File;
  preview: string;
};

type StepVehicleInfoProps = Readonly<{
  carInfo: CarInfo;
  setCarInfo: React.Dispatch<React.SetStateAction<CarInfo>>;
  setVehiclePhotos: React.Dispatch<React.SetStateAction<File[]>>;
  setChassisPhoto: React.Dispatch<React.SetStateAction<File | null>>;
  setPlatePhoto: React.Dispatch<React.SetStateAction<File | null>>;
  setOdometerPhoto: React.Dispatch<React.SetStateAction<File | null>>;
  setCarteGriseFile: React.Dispatch<React.SetStateAction<File | null>>;
  setPreviousInsuranceFile: React.Dispatch<React.SetStateAction<File | null>>;
  missingFields: string[];
}>;

export default function StepVehicleInfo({
  carInfo,
  setCarInfo,
  setVehiclePhotos,
  setChassisPhoto,
  setPlatePhoto,
  setOdometerPhoto,
  setCarteGriseFile,
  setPreviousInsuranceFile,
  missingFields,
}: StepVehicleInfoProps) {
  const [vehiclePhotosList, setVehiclePhotosList] = useState<UploadedFile[]>([]);
  const [chassisPhotoFile, setChassisPhotoFile] = useState<UploadedFile | null>(null);
  const [platePhotoFile, setPlatePhotoFile] = useState<UploadedFile | null>(null);
  const [odometerPhotoFile, setOdometerPhotoFile] = useState<UploadedFile | null>(null);
  const [carteGriseUploaded, setCarteGriseUploaded] = useState<UploadedFile | null>(null);
  const [previousInsuranceUploaded, setPreviousInsuranceUploaded] = useState<UploadedFile | null>(null);

  const handleVehiclePhotosChange = (files: FileList | null) => {
    if (!files) {
      return;
    }

    const newFiles = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setVehiclePhotosList((prev) => [...prev, ...newFiles]);
    setVehiclePhotos((prev) => [...prev, ...Array.from(files)]);
  };

  const handleSinglePhotoChange = (
    files: FileList | null,
    setSetter: (file: UploadedFile | null) => void,
    setStateFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    const uploadedFile = {
      file,
      preview: URL.createObjectURL(file),
    };

    setSetter(uploadedFile);
    setStateFile(file);
  };

  const removeVehiclePhoto = (index: number) => {
    setVehiclePhotosList((prev) => {
      const target = prev[index];
      if (target?.preview) {
        URL.revokeObjectURL(target.preview);
      }

      return prev.filter((_, i) => i !== index);
    });

    setVehiclePhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeSinglePhoto = (
    setSetter: (file: UploadedFile | null) => void,
    setStateFile: React.Dispatch<React.SetStateAction<File | null>>,
    file: UploadedFile | null
  ) => {
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }

    setSetter(null);
    setStateFile(null);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">
        2. Informations Vehicule (obligatoire)
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Renseignez toutes les donnees obligatoires pour valider le contrat.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:grid-cols-2 sm:p-5">
        <Field label="Vehicle Brand" required>
          <TextInput
            value={carInfo.brand}
            onChange={(v) => setCarInfo((p) => ({ ...p, brand: v }))}
            placeholder="e.g. Toyota"
          />
        </Field>

        <Field label="Vehicle Model" required>
          <TextInput
            value={carInfo.model}
            onChange={(v) => setCarInfo((p) => ({ ...p, model: v }))}
            placeholder="e.g. Corolla"
          />
        </Field>

        <Field label="Version / Trim" required>
          <TextInput
            value={carInfo.version}
            onChange={(v) => setCarInfo((p) => ({ ...p, version: v }))}
            placeholder="e.g. 1.6 GX"
          />
        </Field>

        <Field label="Fiscal Power (CV)" required>
          <NumericInput
            value={carInfo.horsepower}
            onChange={(v) => setCarInfo((p) => ({ ...p, horsepower: v }))}
            placeholder="e.g. 8"
            min={1}
          />
        </Field>

        <Field label="Fuel Type" required>
          <SelectInput
            value={carInfo.energy}
            onChange={(v) => setCarInfo((p) => ({ ...p, energy: v }))}
            options={["Essence", "Diesel", "Hybride", "Électrique", "GPL"]}
            placeholder="Select fuel type..."
          />
        </Field>

        <Field label="Number of Seats" required>
          <NumericInput
            value={carInfo.seats}
            onChange={(v) => setCarInfo((p) => ({ ...p, seats: v }))}
            placeholder="e.g. 5"
            min={1}
          />
        </Field>

        <Field label="Parking Type" required>
          <SelectInput
            value={carInfo.parking}
            onChange={(v) => setCarInfo((p) => ({ ...p, parking: v }))}
            options={["Garage privé", "Parking couvert", "Voie publique", "Résidence sécurisée"]}
            placeholder="Select parking type..."
          />
        </Field>

        <Field label="Registration Number" required>
          <TextInput
            value={carInfo.registration}
            onChange={(v) => setCarInfo((p) => ({ ...p, registration: v }))}
            placeholder="e.g. 12345-678-09"
          />
        </Field>

        <Field label="Carte Grise Number" required>
          <TextInput
            value={carInfo.carteGriseNumber ?? ""}
            onChange={(v) => setCarInfo((p) => ({ ...p, carteGriseNumber: v }))}
            placeholder="e.g. 09-123456-16"
          />
        </Field>

        <Field label="Chassis Number (VIN)" required>
          <TextInput
            value={carInfo.chassisNumber}
            onChange={(v) => setCarInfo((p) => ({ ...p, chassisNumber: v }))}
            placeholder="17-character VIN"
          />
        </Field>

        <Field label="First Registration Date" required>
          <input
            type="date"
            value={carInfo.firstRegistrationDate}
            onChange={(e) => setCarInfo((p) => ({ ...p, firstRegistrationDate: e.target.value }))}
            className={inputCls}
          />
        </Field>

        <Field label="Market Value (DZD)" required>
          <NumericInput
            value={carInfo.marketValue}
            onChange={(v) => setCarInfo((p) => ({ ...p, marketValue: v }))}
            placeholder="e.g. 2500000"
          />
        </Field>

        <Field label="Vehicle Usage" required>
          <SelectInput
            value={carInfo.usage}
            onChange={(v) => setCarInfo((p) => ({ ...p, usage: v }))}
            options={["Personnel", "Affaires", "Auto-École", "Commerce", "Transport"]}
            placeholder="Select usage..."
          />
        </Field>

        <Field label="Circulation Zone" required>
          <SelectInput
            value={carInfo.circulationZone}
            onChange={(v) => setCarInfo((p) => ({ ...p, circulationZone: v }))}
            options={["Ville", "Wilaya", "National"]}
            placeholder="Select zone..."
          />
        </Field>

        <Field label="Insured Capital (DZD)" required>
          <NumericInput
            value={carInfo.insuredCapital}
            onChange={(v) => setCarInfo((p) => ({ ...p, insuredCapital: v }))}
            placeholder="e.g. 100000"
          />
        </Field>

        <Field label="Current Mileage (km)" required>
          <NumericInput
            value={carInfo.mileage}
            onChange={(v) => setCarInfo((p) => ({ ...p, mileage: v }))}
            placeholder="e.g. 45000"
          />
        </Field>

        <Field label="Estimated km / Year" required>
          <NumericInput
            value={carInfo.estimatedKmPerYear}
            onChange={(v) => setCarInfo((p) => ({ ...p, estimatedKmPerYear: v }))}
            placeholder="e.g. 15000"
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Technical Certificate Notes">
            <textarea
              value={carInfo.technicalCertificate}
              onChange={(e) => setCarInfo((p) => ({ ...p, technicalCertificate: e.target.value }))}
              placeholder="Observations from the last technical inspection..."
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </Field>
        </div>
      </div>

      {/* ── Driver behaviour ─────────────────────────────── */}
      <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
        <h3 className="mb-4 text-sm font-bold text-gray-800">Driver Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Peak-hour driving (hours/day)">
            <NumericInput
              value={carInfo.peakHoursDriving ?? ""}
              onChange={(v) => setCarInfo((p) => ({ ...p, peakHoursDriving: v }))}
              placeholder="e.g. 2"
            />
          </Field>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-gray-500">Night driving?</p>
            <div className="flex gap-2">
              {(["yes", "no"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setCarInfo((p) => ({ ...p, nightDrive: v }))}
                  className={`flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    carInfo.nightDrive === v
                      ? "border-blue-400 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {v === "yes" ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-gray-500">Prior traffic violations? (مخالفات سابقة)</p>
            <div className="flex gap-2">
              {(["yes", "no"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setCarInfo((p) => ({ ...p, priorViolations: v }))}
                  className={`flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    carInfo.priorViolations === v
                      ? "border-amber-400 bg-amber-50 text-amber-700"
                      : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {v === "yes" ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-gray-500">Prior accidents? (حوادث سابقة)</p>
            <div className="flex gap-2">
              {(["yes", "no"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setCarInfo((p) => ({ ...p, priorAccidents: v }))}
                  className={`flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    carInfo.priorAccidents === v
                      ? "border-rose-400 bg-rose-50 text-rose-700"
                      : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {v === "yes" ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <UploadBlock
          id="vehicle-photos"
          title="Photos du vehicule (tous les angles)"
          accept="image/*"
          files={vehiclePhotosList}
          onChange={(files) => handleVehiclePhotosChange(files)}
          onRemove={(index) => removeVehiclePhoto(index)}
          hint="Ajoutez au minimum 4 photos."
          multiple
        />

        <UploadBlock
          id="chassis-photo"
          title="Photo du chassis (VIN)"
          accept="image/*"
          files={chassisPhotoFile ? [chassisPhotoFile] : []}
          onChange={(files) =>
            handleSinglePhotoChange(
              files,
              setChassisPhotoFile,
              setChassisPhoto
            )
          }
          onRemove={() =>
            removeSinglePhoto(
              setChassisPhotoFile,
              setChassisPhoto,
              chassisPhotoFile
            )
          }
          hint="Photo claire du numero de chassis."
        />

        <UploadBlock
          id="plate-photo"
          title="Photo de la plaque"
          accept="image/*"
          files={platePhotoFile ? [platePhotoFile] : []}
          onChange={(files) =>
            handleSinglePhotoChange(files, setPlatePhotoFile, setPlatePhoto)
          }
          onRemove={() =>
            removeSinglePhoto(setPlatePhotoFile, setPlatePhoto, platePhotoFile)
          }
          hint="Photo claire de la plaque d'immatriculation."
        />

        <UploadBlock
          id="odometer-photo"
          title="Photo du tableau de bord (Compteur)"
          accept="image/*"
          files={odometerPhotoFile ? [odometerPhotoFile] : []}
          onChange={(files) =>
            handleSinglePhotoChange(
              files,
              setOdometerPhotoFile,
              setOdometerPhoto
            )
          }
          onRemove={() =>
            removeSinglePhoto(
              setOdometerPhotoFile,
              setOdometerPhoto,
              odometerPhotoFile
            )
          }
          hint="Photo du compteur kilometrique visible."
        />

        <UploadBlock
          id="carte-grise"
          title="Carte Grise (Registration Document)"
          accept="application/pdf,image/*"
          files={carteGriseUploaded ? [carteGriseUploaded] : []}
          onChange={(files) =>
            handleSinglePhotoChange(files, setCarteGriseUploaded, setCarteGriseFile)
          }
          onRemove={() =>
            removeSinglePhoto(
              setCarteGriseUploaded,
              setCarteGriseFile,
              carteGriseUploaded
            )
          }
          hint="Upload a clear scan or photo of the carte grise."
        />

        <UploadBlock
          id="previous-insurance"
          title="Previous Insurance Contract"
          accept="application/pdf,image/*"
          files={previousInsuranceUploaded ? [previousInsuranceUploaded] : []}
          onChange={(files) =>
            handleSinglePhotoChange(
              files,
              setPreviousInsuranceUploaded,
              setPreviousInsuranceFile
            )
          }
          onRemove={() =>
            removeSinglePhoto(
              setPreviousInsuranceUploaded,
              setPreviousInsuranceFile,
              previousInsuranceUploaded
            )
          }
          hint="Upload your previous insurance contract (optional)."
        />
      </div>

      {missingFields.length > 0 && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
          <p className="mb-1 font-semibold">Champs manquants :</p>
          <ul className="list-disc pl-4 space-y-0.5">
            {missingFields.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

type UploadBlockProps = {
  id: string;
  title: string;
  accept: string;
  files: UploadedFile[];
  onChange: (files: FileList | null) => void;
  onRemove: (index: number) => void;
  hint: string;
  multiple?: boolean;
};

function UploadBlock({
  id,
  title,
  accept,
  files,
  onChange,
  onRemove,
  hint,
  multiple,
}: Readonly<UploadBlockProps>) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-600">{hint}</p>
        </div>
        <label
          htmlFor={id}
          className="cursor-pointer rounded-lg border border-cyan-400 bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100"
        >
          Ajouter
        </label>
      </div>

      <input
        id={id}
        type="file"
        multiple={multiple}
        accept={accept}
        capture={accept.startsWith("image") ? "environment" : undefined}
        onChange={(e) => onChange(e.target.files)}
        className="hidden"
      />

      {files.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-4 text-center text-xs text-gray-500">
          Aucun fichier televerse pour le moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {files.map((item, index) => (
            <div
              key={`${item.file.name}-${index}`}
              className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
            >
              <img
                src={item.preview}
                alt={item.file.name}
                className="mb-2 h-32 w-full rounded-lg object-cover"
              />
              <p className="truncate text-xs font-medium text-gray-700">
                {item.file.name}
              </p>
              <p className="text-xs text-gray-500">
                {(item.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="mt-2 text-xs font-semibold text-red-600 transition hover:text-red-700"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
