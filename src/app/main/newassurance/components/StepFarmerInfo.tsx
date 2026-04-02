"use client";

import { Input, Label } from "@heroui/react";
import { FarmerInfo } from "../types";

type StepFarmerInfoProps = Readonly<{
  farmerInfo: FarmerInfo;
  setFarmerInfo: (info: FarmerInfo) => void;
  canGoNext: boolean;
}>;

export default function StepFarmerInfo({
  farmerInfo,
  setFarmerInfo,
  canGoNext,
}: StepFarmerInfoProps) {
  const handleChange = (field: keyof FarmerInfo, value: string) => {
    setFarmerInfo({
      ...farmerInfo,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">
        2. Informations agricoles
      </h2>
      <p className="text-sm text-gray-500">
        Renseignez votre activite, votre materiel et vos donnees de production.
      </p>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-gray-700">
          1 - Les informations de matériels
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col">
            <Label className="text-gray-500 text-xs">Type de matériel</Label>
          <Input
            placeholder="Ex: Tracteur, Moissonneuse..."
            value={farmerInfo.equipmentType}
            onChange={(e) => handleChange("equipmentType", e.target.value)}
            
          />
          </div>
          <div className="flex flex-col">
            <Label className="text-gray-500 text-xs">Marque et modèle du matériel</Label>
            <Input
            placeholder="Ex: John Deere, Massey Ferguson..."
            value={farmerInfo.equipmentBrand}
            onChange={(e) => handleChange("equipmentBrand", e.target.value)}
            
          />
          </div>
          <div className="flex flex-col">
            <Label className="text-gray-500 text-xs">Modèle du matériel</Label>
            <Input
            placeholder="Ex: 5090, 4707..."
            value={farmerInfo.equipmentModel}
            onChange={(e) => handleChange("equipmentModel", e.target.value)}
            
          />
          </div>
        <div className="flex flex-col">
          <Label className="text-gray-500 text-xs">Année de fabrication</Label>
          <Input
            type="number"
            placeholder="2020"
            value={farmerInfo.equipmentYear}
            onChange={(e) => handleChange("equipmentYear", e.target.value)}
            
          />
        </div>
        <div className="flex flex-col">
          <Label className="text-gray-500 text-xs">Valeur du matériel (DA)</Label>
          <Input
            type="number"
            placeholder="100000"
            value={farmerInfo.equipmentValue}
            onChange={(e) => handleChange("equipmentValue", e.target.value)}
            
          />
        </div>
          <div className="flex flex-col">
            <Label className="text-gray-500 text-xs">Quantité</Label>
             <Input
            type="number"
            placeholder="1"
            value={farmerInfo.equipmentQuantity}
            onChange={(e) => handleChange("equipmentQuantity", e.target.value)}
            
          />
          </div>
         
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-gray-700">
          2 - Les informations concernant l&apos;agriculteure, les cultures agri et les animaux
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-gray-500 text-xs">Superficie agricole (hectares)</Label>
          <Input
            type="number"
            placeholder="50"
            value={farmerInfo.farmArea}
            onChange={(e) => handleChange("farmArea", e.target.value)}
            
          />
          </div>
          <div>
            <Label className="text-gray-500 text-xs">Types de cultures</Label>
          <Input
            placeholder="Ex: Blé, Orge, Maïs, Tomate..."
            value={farmerInfo.cropTypes}
            onChange={(e) => handleChange("cropTypes", e.target.value)}
            className="min-h-20"
            
          />
          </div>
          <div>
            <Label className="text-gray-500 text-xs">Production annuelle estimée (tonnes)</Label>
          <Input
            type="number"
            placeholder="100"
            value={farmerInfo.cropProduction}
            onChange={(e) => handleChange("cropProduction", e.target.value)}
            
          />
          </div>
          <div>
            <Label className="text-gray-500 text-xs">Types de bétail</Label>
          <Input
            placeholder="Ex: Vaches, Moutons, Chevèvres, Poules..."
            value={farmerInfo.livestockTypes}
            onChange={(e) => handleChange("livestockTypes", e.target.value)}
            
          />
          </div>
          <div>
            <Label className="text-gray-500 text-xs">Nombre d&apos;animaux</Label>
          <Input
            type="number"
            placeholder="50"
            value={farmerInfo.livestockQuantity}
            onChange={(e) => handleChange("livestockQuantity", e.target.value)}
            
          />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-gray-500 text-xs">Années d&apos;expérience agricole</Label>
          <Input
            type="number"
            placeholder="10"
            value={farmerInfo.farmingExperience}
            onChange={(e) => handleChange("farmingExperience", e.target.value)}
            
          />    
          </div>

        </div>
      </div>

      {!canGoNext && (
        <p className="text-xs text-amber-600">
          Veuillez remplir tous les champs obligatoires pour continuer.
        </p>
      )}
    </div>
  );
}
