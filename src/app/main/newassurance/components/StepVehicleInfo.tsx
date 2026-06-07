"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
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
        2. Vehicle Information (required)
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Fill in all required fields to validate the contract.
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
          title="Vehicle Photos (all angles)"
          accept="image/*"
          files={vehiclePhotosList}
          onChange={(files) => handleVehiclePhotosChange(files)}
          onRemove={(index) => removeVehiclePhoto(index)}
          hint="Add at least 1 photo."
          multiple
        />

        <UploadBlock
          id="chassis-photo"
          title="Chassis Photo (VIN)"
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
          hint="Clear photo of the chassis number."
        />

        <UploadBlock
          id="plate-photo"
          title="License Plate Photo"
          accept="image/*"
          files={platePhotoFile ? [platePhotoFile] : []}
          onChange={(files) =>
            handleSinglePhotoChange(files, setPlatePhotoFile, setPlatePhoto)
          }
          onRemove={() =>
            removeSinglePhoto(setPlatePhotoFile, setPlatePhoto, platePhotoFile)
          }
          hint="Clear photo of the license plate."
        />

        <CameraCapture
          title="Photo du tableau de bord (Compteur)"
          hint="Take a photo of the dashboard showing the odometer reading."
          file={odometerPhotoFile}
          onCapture={(f) => {
            const uploaded = { file: f, preview: URL.createObjectURL(f) };
            setOdometerPhotoFile(uploaded);
            setOdometerPhoto(f);
          }}
          onRemove={() => removeSinglePhoto(setOdometerPhotoFile, setOdometerPhoto, odometerPhotoFile)}
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
          <p className="mb-1 font-semibold">Missing fields:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            {missingFields.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Camera capture (in-app viewfinder) ───────────────────────────────────────

function CameraCapture({
  title,
  hint,
  file,
  onCapture,
  onRemove,
}: {
  title: string;
  hint: string;
  file: UploadedFile | null;
  onCapture: (f: File) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [err, setErr] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const openCamera = async () => {
    setErr("");
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      setStream(s);
      setOpen(true);
    } catch {
      setErr("Camera unavailable — check browser permissions.");
    }
  };

  useEffect(() => {
    if (open && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [open, stream]);

  useEffect(() => {
    return () => { stream?.getTracks().forEach((t) => t.stop()); };
  }, [stream]);

  const closeCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setOpen(false);
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const captured = new File([blob], `odometer-${Date.now()}.jpg`, { type: "image/jpeg" });
      onCapture(captured);
      closeCamera();
    }, "image/jpeg", 0.85);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-500">{hint}</p>
      </div>

      {file ? (
        <div>
          <img src={file.preview} alt="Odometer" className="h-44 w-full rounded-xl object-cover" />
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-gray-500 truncate max-w-[70%]">{file.file.name}</p>
            <button type="button" onClick={onRemove}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1">
              <FaCamera className="text-[10px]" /> Retake
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <button
            type="button"
            onClick={openCamera}
            className="w-full rounded-xl border-2 border-dashed border-cyan-300 bg-cyan-50 py-8 flex flex-col items-center gap-2.5 text-cyan-700 hover:bg-cyan-100 transition"
          >
            <FaCamera className="text-3xl" />
            <span className="text-sm font-semibold">Take Photo</span>
            <span className="text-xs text-cyan-500">Opens your camera</span>
          </button>
          {err && <p className="text-xs text-red-500 text-center">{err}</p>}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black">
          <video ref={videoRef} autoPlay playsInline muted className="flex-1 w-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex items-center justify-between px-8 py-6 bg-black/90">
            <button type="button" onClick={closeCamera}
              className="text-white/70 text-sm font-medium hover:text-white transition px-3 py-2">
              Cancel
            </button>
            <button
              type="button"
              onClick={capture}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:scale-95 transition-transform"
              aria-label="Capture photo"
            >
              <div className="w-14 h-14 rounded-full bg-white" />
            </button>
            <div className="w-16" />
          </div>
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
          Add
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
          No file uploaded yet.
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
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
