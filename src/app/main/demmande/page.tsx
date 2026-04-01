
"use client";

import { FormEvent, useMemo, useState } from "react";

type UploadedFile = {
  file: File;
  preview?: string;
};

export default function Page() {
  const [accidentDateTime, setAccidentDateTime] = useState("");
  const [currentDateTime] = useState(() => new Date().toISOString().slice(0, 16));
  const [locationText, setLocationText] = useState("");
  const [description, setDescription] = useState("");
  const [injuries, setInjuries] = useState("Aucune");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [weather, setWeather] = useState("");
  const [policeReportNumber, setPoliceReportNumber] = useState("");
  const [witnesses, setWitnesses] = useState("");

  const [photos, setPhotos] = useState<UploadedFile[]>([]);
  const [videos, setVideos] = useState<UploadedFile[]>([]);
  const [documents, setDocuments] = useState<UploadedFile[]>([]);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const suggestedUploads = useMemo(
    () => [
      "Photos claires de tous les angles (avant, arriere, cotes).",
      "Photo du permis de conduire et de la piece d'identite.",
      "Photo de la carte d'assurance et de la carte grise.",
      "Courte video montrant le lieu de l'accident et l'etat de la route.",
      "Proces-verbal de police ou numero de declaration si disponible.",
      "Informations des temoins (nom + numero de telephone).",
      "Facture de remorquage ou de premiere reparation si disponible.",
    ],
    []
  );

  const handleFiles = (
    files: FileList | null,
    setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
    withPreview = false
  ) => {
    if (!files || files.length === 0) {
      return;
    }

    const nextFiles: UploadedFile[] = Array.from(files).map((file) => ({
      file,
      preview: withPreview ? URL.createObjectURL(file) : undefined,
    }));

    setter((prev) => [...prev, ...nextFiles]);
  };

  const removeFile = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>
  ) => {
    setter((prev) => {
      const target = prev[index];
      if (target?.preview) {
        URL.revokeObjectURL(target.preview);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("Les informations de l'accident ont ete enregistrees avec succes.");
  };

  return (
    <section className="relative z-10 mx-auto my-24 max-w-5xl rounded-3xl border border-cyan-500/50 bg-white/90 p-6 shadow-xl md:p-10">
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-800 md:text-3xl">
          Demande de declaration d'accident
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          En cas d'accident, veuillez remplir toutes les informations avec precision pour accelerer le traitement de votre dossier.
        </p>
      </header>

      {successMessage ? (
        <p className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            id="current-time"
            label="Heure actuelle (automatique)"
            value={currentDateTime}
            onChange={() => undefined}
            disabled
            type="datetime-local"
          />
          <Field
            id="accident-time"
            label="Date et heure de l'accident"
            value={accidentDateTime}
            onChange={setAccidentDateTime}
            type="datetime-local"
            required
          />
          <Field
            id="location"
            label="Lieu de l'accident"
            value={locationText}
            onChange={setLocationText}
            placeholder="Wilaya, commune, rue, point de repere"
            required
          />
          <Field
            id="plate"
            label="Numero du vehicule"
            value={vehiclePlate}
            onChange={setVehiclePlate}
            placeholder="Ex: 123456 - 16"
            required
          />
          <Field
            id="weather"
            label="Conditions meteorologiques"
            value={weather}
            onChange={setWeather}
            placeholder="Ensoleille, pluvieux, brouillard..."
          />
          <Field
            id="police-report"
            label="Numero du proces-verbal de police (si disponible)"
            value={policeReportNumber}
            onChange={setPoliceReportNumber}
          />
        </div>

        <div>
          <label
            htmlFor="accident-description"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Description de l'accident
          </label>
          <textarea
            id="accident-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            placeholder="Decrivez les circonstances, la direction du vehicule, les degats visibles..."
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            id="injuries"
            label="Blessures corporelles"
            value={injuries}
            onChange={setInjuries}
            placeholder="Aucune / Legere / Grave"
          />
          <Field
            id="witnesses"
            label="Temoins (nom + telephone)"
            value={witnesses}
            onChange={setWitnesses}
            placeholder="Ex: Ahmed 0550xxxxxx"
          />
        </div>

        <UploadBlock
          id="photos-upload"
          title="Photos de l'accident"
          accept="image/*"
          files={photos}
          onChange={(files) => handleFiles(files, setPhotos, true)}
          onRemove={(index) => removeFile(index, setPhotos)}
          hint="Ajoutez des photos depuis differents angles."
        />

        <UploadBlock
          id="videos-upload"
          title="Videos (optionnel)"
          accept="video/*"
          files={videos}
          onChange={(files) => handleFiles(files, setVideos)}
          onRemove={(index) => removeFile(index, setVideos)}
          hint="Une courte video peut aider a clarifier la scene."
        />

        <UploadBlock
          id="documents-upload"
          title="Documents justificatifs"
          accept=".pdf,image/*"
          files={documents}
          onChange={(files) => handleFiles(files, setDocuments)}
          onRemove={(index) => removeFile(index, setDocuments)}
          hint="Proces-verbal, carte d'assurance, permis de conduire, carte grise..."
        />

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <h2 className="mb-2 text-sm font-bold text-blue-800">Pieces recommandees</h2>
          <ul className="space-y-1 text-sm text-blue-700">
            {suggestedUploads.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Enregistrer la declaration d'accident
        </button>
      </form>
    </section>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "datetime-local";
  required?: boolean;
  disabled?: boolean;
};

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  disabled,
}: Readonly<FieldProps>) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 disabled:cursor-not-allowed disabled:bg-gray-100"
      />
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
};

function UploadBlock({
  id,
  title,
  accept,
  files,
  onChange,
  onRemove,
  hint,
}: Readonly<UploadBlockProps>) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-600">{hint}</p>
        </div>
        <label
          htmlFor={id}
          className="cursor-pointer rounded-lg border border-cyan-400 bg-white px-3 py-2 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-50"
        >
          Ajouter des fichiers
        </label>
      </div>

      <input
        id={id}
        type="file"
        multiple
        accept={accept}
        onChange={(e) => onChange(e.target.files)}
        className="hidden"
      />

      {files.length === 0 ? (
        <p className="text-xs text-gray-500">Aucun fichier televerse pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {files.map((item, index) => (
            <div
              key={`${item.file.name}-${index}`}
              className="rounded-xl border border-gray-200 bg-white p-3"
            >
              {item.preview ? (
                <img
                  src={item.preview}
                  alt={item.file.name}
                  className="mb-2 h-32 w-full rounded-lg object-cover"
                />
              ) : null}
              <p className="truncate text-xs font-medium text-gray-700">{item.file.name}</p>
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
