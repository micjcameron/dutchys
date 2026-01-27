import { CheckoutFormData } from '@/types/checkout';
import { Button } from '@/components/ui/button';

type CheckoutFormProps = {
  value: CheckoutFormData;
  isSubmitting: boolean;
  onChange: (next: CheckoutFormData) => void;
  onSubmit: () => void;
};

const inputClassName =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/30';

export default function CheckoutForm({ value, isSubmitting, onChange, onSubmit }: CheckoutFormProps) {
  const updateField = (field: keyof CheckoutFormData, nextValue: string) => {
    onChange({
      ...value,
      [field]: nextValue,
    });
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <h2 className="text-xl font-semibold text-brand-blue mb-2">Jouw gegevens</h2>
        <p className="text-sm text-gray-600">Vul je gegevens in zodat we je bestelling kunnen verwerken.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Voornaam</label>
          <input
            type="text"
            className={inputClassName}
            value={value.firstName}
            onChange={(event) => updateField('firstName', event.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Achternaam</label>
          <input
            type="text"
            className={inputClassName}
            value={value.lastName}
            onChange={(event) => updateField('lastName', event.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">E-mailadres</label>
          <input
            type="email"
            className={inputClassName}
            value={value.email}
            onChange={(event) => updateField('email', event.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Telefoonnummer (optioneel)</label>
          <input
            type="tel"
            className={inputClassName}
            value={value.phone}
            onChange={(event) => updateField('phone', event.target.value)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-brand-blue mb-2">Bezorgadres</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Straat</label>
            <input
              type="text"
              className={inputClassName}
              value={value.street}
              onChange={(event) => updateField('street', event.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Huisnummer</label>
            <input
              type="text"
              className={inputClassName}
              value={value.houseNumber}
              onChange={(event) => updateField('houseNumber', event.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Postcode</label>
            <input
              type="text"
              className={inputClassName}
              value={value.postalCode}
              onChange={(event) => updateField('postalCode', event.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Plaats</label>
            <input
              type="text"
              className={inputClassName}
              value={value.city}
              onChange={(event) => updateField('city', event.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Land</label>
            <input
              type="text"
              className={inputClassName}
              value={value.country}
              onChange={(event) => updateField('country', event.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Bezorgnotities (optioneel)</label>
        <textarea
          className={`${inputClassName} min-h-[120px]`}
          value={value.deliveryNotes}
          onChange={(event) => updateField('deliveryNotes', event.target.value)}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-brand-orange text-white hover:bg-brand-orange/90"
        disabled={isSubmitting}
      >
        Betaal nu
      </Button>
    </form>
  );
}
