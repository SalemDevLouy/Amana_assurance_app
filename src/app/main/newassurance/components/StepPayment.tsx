import { Card, CardHeader, Checkbox, Description, Input, Label, Radio, RadioGroup } from "@heroui/react";
import { GuaranteeOption, PaymentInfo } from "../types";

type StepPaymentProps = Readonly<{
  payment: PaymentInfo;
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
    <div>
      <h2 className="text-lg font-semibold text-gray-800">4. Payment</h2>
      <p className="mt-1 text-sm text-gray-500">Finalisez votre demande et confirmez le paiement.</p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Label className="sr-only">Nom complet</Label>
        <Input type="text" value={payment.fullName} placeholder="Nom complet" />
        <Label className="sr-only">Email</Label>
        <Input type="email" value={payment.email} placeholder="Email" />
        <Label className="sr-only">Telephone</Label>
        <Input type="tel" value={payment.phone} className="sm:col-span-2" placeholder="Telephone" />
      </div>

      <Card className="mt-5 border border-gray-200 bg-gray-50">
        <CardHeader className="pb-0 text-sm font-semibold text-gray-700">Resume du contrat</CardHeader>
        <div className="pt-2">
          <p className="text-sm text-gray-600">Type assurance: {assuranceType || "-"}</p>
          <p className="mt-1 text-sm text-gray-600">
            Vehicule: {carBrand || "-"} {carModel || "-"} ({registration || "-"})
          </p>

          <div className="mt-3 space-y-1">
            <p className="text-sm font-semibold text-gray-700">Garanties selectionnees (Etape 3)</p>
            {selectedGuaranteesSummary.map((guarantee) => (
              <div key={guarantee.id} className="flex items-center justify-between text-sm text-gray-600">
                <span>{guarantee.label}</span>
                <span>{guarantee.price > 0 ? `${guarantee.price} DA` : "Inclus"}</span>
              </div>
            ))}
          </div>

          <p className="mt-3 text-sm text-gray-600">Base: {basePrice} DZD</p>
          <p className="mt-1 text-sm text-gray-600">Options: {optionsTotal} DZD</p>
          <p className="mt-2 text-base font-bold text-gray-900">Total: {totalCost} DZD</p>
        </div>
      </Card>

      <div className="mt-5 space-y-3">
        <RadioGroup name="payment-method" orientation="horizontal">
          <Label>Methode de paiement</Label>
          <Description>Choisissez le mode de paiement que vous preferez.</Description>
          <Radio value="card">
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            <Radio.Content>
              <Label>Carte bancaire</Label>
              <Description>Paiement securise par carte.</Description>
            </Radio.Content>
          </Radio>
          <Radio value="transfer">
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            <Radio.Content>
              <Label>Virement</Label>
              <Description>Transfert bancaire classique.</Description>
            </Radio.Content>
          </Radio>
          <Radio value="cash">
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            <Radio.Content>
              <Label>Especes</Label>
              <Description>Paiement en especes a l&apos;agence.</Description>
            </Radio.Content>
          </Radio>
        </RadioGroup>

        <Checkbox>J&apos;accepte les conditions generales du contrat.</Checkbox>
      </div>
    </div>
  );
}
