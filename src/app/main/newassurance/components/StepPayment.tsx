import { Dispatch, SetStateAction } from "react";
import { Card, CardHeader, Checkbox, Description, Input, Label, Radio, RadioGroup } from "@heroui/react";
import { GuaranteeOption, PaymentInfo } from "../types";

type StepPaymentProps = Readonly<{
  payment: PaymentInfo;
  setPayment: Dispatch<SetStateAction<PaymentInfo>>;
  assuranceType: string;
  carBrand: string;
  carModel: string;
  registration: string;
  selectedGuaranteesSummary: GuaranteeOption[];
  basePrice: number;
  optionsTotal: number;
  totalCost: number;
}>;

export default function StepPayment({
  payment,
  setPayment,
  assuranceType,
  carBrand,
  carModel,
  registration,
  selectedGuaranteesSummary,
  basePrice,
  optionsTotal,
  totalCost,
}: StepPaymentProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">4. Payment</h2>
      <p className="mt-1 text-sm text-gray-500">Finalisez votre demande et confirmez le paiement.</p>

      <div className="mt-5 grid grid-cols-1 gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:grid-cols-2 sm:p-5">
        <div>
          <Label className="mb-1 block text-xs font-semibold text-gray-500">Nom complet</Label>
          <Input
            type="text"
            value={payment.fullName}
            placeholder="Nom complet"
            onChange={(e) => setPayment((prev) => ({ ...prev, fullName: e.target.value }))}
          />
        </div>
        <div>
          <Label className="mb-1 block text-xs font-semibold text-gray-500">Email</Label>
          <Input
            type="email"
            value={payment.email}
            placeholder="Email"
            onChange={(e) => setPayment((prev) => ({ ...prev, email: e.target.value }))}
          />
        </div>
        <div className="sm:col-span-2">
          <Label className="mb-1 block text-xs font-semibold text-gray-500">Téléphone</Label>
          <Input
            type="tel"
            value={payment.phone}
            placeholder="Téléphone"
            onChange={(e) => setPayment((prev) => ({ ...prev, phone: e.target.value }))}
          />
        </div>
      </div>

      <Card className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50/60">
        <CardHeader className="pb-0 text-sm font-semibold text-cyan-900">Résumé du contrat</CardHeader>
        <div className="space-y-2 px-4 pb-4 pt-2">
          <p className="text-sm text-gray-600">Type assurance: {assuranceType || "-"}</p>
          <p className="mt-1 text-sm text-gray-600">
            Véhicule: {carBrand || "-"} {carModel || "-"} ({registration || "-"})
          </p>

          <div className="mt-3 space-y-1">
            <p className="text-sm font-semibold text-gray-700">Garanties sélectionnées</p>
            {selectedGuaranteesSummary.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune option additionnelle.</p>
            ) : (
              selectedGuaranteesSummary.map((guarantee) => (
                <div key={guarantee.id} className="flex items-center justify-between text-sm text-gray-600">
                  <span>{guarantee.label}</span>
                  <span>{guarantee.price > 0 ? `${guarantee.price} DA` : "Inclus"}</span>
                </div>
              ))
            )}
          </div>

          <p className="mt-3 text-sm text-gray-600">Base: {basePrice.toLocaleString()} DZD</p>
          <p className="mt-1 text-sm text-gray-600">Options: {optionsTotal.toLocaleString()} DZD</p>
          <p className="mt-2 text-base font-bold text-gray-900">Total: {totalCost.toLocaleString()} DZD</p>
        </div>
      </Card>

      <div className="mt-5 space-y-3 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
        <RadioGroup
          name="payment-method"
          orientation="horizontal"
          value={payment.method}
          onChange={(val) => setPayment((prev) => ({ ...prev, method: val as PaymentInfo["method"] }))}
        >
          <Label>Méthode de paiement</Label>
          <Description>Choisissez le mode de paiement que vous préférez.</Description>
          <Radio value="card">
            <Radio.Control><Radio.Indicator /></Radio.Control>
            <Radio.Content>
              <Label>Carte bancaire</Label>
              <Description>Paiement sécurisé par carte.</Description>
            </Radio.Content>
          </Radio>
          <Radio value="transfer">
            <Radio.Control><Radio.Indicator /></Radio.Control>
            <Radio.Content>
              <Label>Virement</Label>
              <Description>Transfert bancaire classique.</Description>
            </Radio.Content>
          </Radio>
          <Radio value="cash">
            <Radio.Control><Radio.Indicator /></Radio.Control>
            <Radio.Content>
              <Label>Cash</Label>
              <Description>Paiement en espèces en agence.</Description>
            </Radio.Content>
          </Radio>
        </RadioGroup>

        <Checkbox
          isSelected={payment.acceptTerms}
          onChange={(checked) => setPayment((prev) => ({ ...prev, acceptTerms: checked }))}
        >
          J&apos;accepte les conditions générales du contrat.
        </Checkbox>
      </div>
    </div>
  );
}
