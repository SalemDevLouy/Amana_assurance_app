"use client";

import React, { useState } from "react";
import { Input, TextArea } from "@heroui/react";
import { CarInfo } from "../types";

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
  canGoNext: boolean;
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
  canGoNext,
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
        <Input
          type="text"
          value={carInfo.brand}
          onChange={(event) =>
            setCarInfo((prev) => ({ ...prev, brand: event.target.value }))
          }
          placeholder="Marque de véhicule"
        />
        <Input
          type="text"
          value={carInfo.model}
          onChange={(event) =>
            setCarInfo((prev) => ({ ...prev, model: event.target.value }))
          }
          placeholder="Modèle de véhicule"
        />
        <Input
          type="text"
          value={carInfo.version}
          onChange={(event) =>
            setCarInfo((prev) => ({ ...prev, version: event.target.value }))
          }
          placeholder="Version de véhicule"
        />
        <Input
          type="number"
          value={carInfo.horsepower}
          onChange={(event) =>
            setCarInfo((prev) => ({ ...prev, horsepower: event.target.value }))
          }
          placeholder="Puissance fiscale (CV)"
        />
        <Input
          type="text"
          value={carInfo.energy}
          onChange={(event) =>
            setCarInfo((prev) => ({ ...prev, energy: event.target.value }))
          }
          placeholder="Essence, Diesel, Hybride..."
        />
        <Input
          type="number"
          value={carInfo.seats}
          onChange={(event) =>
            setCarInfo((prev) => ({ ...prev, seats: event.target.value }))
          }
          placeholder="Nombre de places"
        />
        <Input
          type="text"
          value={carInfo.parking}
          onChange={(event) =>
            setCarInfo((prev) => ({ ...prev, parking: event.target.value }))
          }
          placeholder="Stationnement (garage, en route...)"
        />
        <Input
          type="text"
          value={carInfo.registration}
          onChange={(event) =>
            setCarInfo((prev) => ({ ...prev, registration: event.target.value }))
          }
          placeholder="Numéro d'immatriculation"
        />
        <Input
          type="text"
          value={carInfo.carteGriseNumber ?? ""}
          onChange={(event) =>
            setCarInfo((prev) => ({ ...prev, carteGriseNumber: event.target.value }))
          }
          placeholder="Numéro de carte grise"
        />
        <Input
          type="text"
          value={carInfo.chassisNumber}
          onChange={(event) =>
            setCarInfo((prev) => ({ ...prev, chassisNumber: event.target.value }))
          }
          placeholder="Numéro de châssis"
        />
        <Input
          type="date"
          value={carInfo.firstRegistrationDate}
          onChange={(event) =>
            setCarInfo((prev) => ({
              ...prev,
              firstRegistrationDate: event.target.value,
            }))
          }
          placeholder="Date de mise en circulation"
        />
        <Input
          type="number"
          value={carInfo.marketValue}
          onChange={(event) =>
            setCarInfo((prev) => ({ ...prev, marketValue: event.target.value }))
          }
          placeholder="Valeur vénale (DZD)"
        />
        <Input
          type="text"
          value={carInfo.usage}
          onChange={(event) =>
            setCarInfo((prev) => ({ ...prev, usage: event.target.value }))
          }
          placeholder="Usage du véhicule (personnel/affaire/auto-école/commerce...)"
        />
        <Input
          type="text"
          value={carInfo.circulationZone}
          onChange={(event) =>
            setCarInfo((prev) => ({
              ...prev,
              circulationZone: event.target.value,
            }))
          }
          placeholder="Zone de circulation (ville, wilaya, national...)"
        />
        <Input
          type="text"
          value={carInfo.insuredCapital}
          onChange={(event) =>
            setCarInfo((prev) => ({
              ...prev,
              insuredCapital: event.target.value,
            }))
          }
          placeholder="Capital assuré (ex: 100000 DZD)"
        />
        <Input
          type="number"
          value={carInfo.mileage}
          onChange={(event) =>
            setCarInfo((prev) => ({ ...prev, mileage: event.target.value }))
          }
          placeholder="Kilométrage actuel (Km)"
        />
        <Input
          type="number"
          value={carInfo.estimatedKmPerYear}
          onChange={(event) =>
            setCarInfo((prev) => ({
              ...prev,
              estimatedKmPerYear: event.target.value,
            }))
          }
          placeholder="Estimation du nombre de Km par an"
        />
        <TextArea
          value={carInfo.technicalCertificate}
          onChange={(event) =>
            setCarInfo((prev) => ({
              ...prev,
              technicalCertificate: event.target.value,
            }))
          }
          placeholder="Redigez le certificat de visite technique..."
          className="sm:col-span-2"
        />
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

      {!canGoNext && (
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
          Tous les champs et documents de l&apos;etape 2 sont obligatoires.
        </p>
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
