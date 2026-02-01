import { CheckoutFormData } from '@/types/checkout';
import { Button } from '@/components/ui/button';

type CheckoutFormProps = {
  value?: CheckoutFormData;
  isSubmitting: boolean;
  onChange: (next: CheckoutFormData) => void;
  onSubmit: () => void;
};

const emptyForm: CheckoutFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street: '',
  houseNumber: '',
  postalCode: '',
  city: '',
  country: 'Nederland',
  deliveryNotes: '',
};

const inputClassName =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/30';

export default function CheckoutForm({ value, isSubmitting, onChange, onSubmit }: CheckoutFormProps) {
  const safeValue = value ?? emptyForm;
  const updateField = (field: keyof CheckoutFormData, nextValue: string) => {
    onChange({
      ...safeValue,
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
            value={safeValue.firstName}
            onChange={(event) => updateField('firstName', event.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Achternaam</label>
          <input
            type="text"
            className={inputClassName}
            value={safeValue.lastName}
            onChange={(event) => updateField('lastName', event.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">E-mailadres</label>
          <input
            type="email"
            className={inputClassName}
            value={safeValue.email}
            onChange={(event) => updateField('email', event.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Telefoonnummer (optioneel)</label>
          <input
            type="tel"
            className={inputClassName}
            value={safeValue.phone}
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
              value={safeValue.street}
              onChange={(event) => updateField('street', event.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Huisnummer</label>
            <input
              type="text"
              className={inputClassName}
              value={safeValue.houseNumber}
              onChange={(event) => updateField('houseNumber', event.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Postcode</label>
            <input
              type="text"
              className={inputClassName}
              value={safeValue.postalCode}
              onChange={(event) => updateField('postalCode', event.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Plaats</label>
            <input
              type="text"
              className={inputClassName}
              value={safeValue.city}
              onChange={(event) => updateField('city', event.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Land</label>
            <input
              type="text"
              className={inputClassName}
              value={safeValue.country}
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
          value={safeValue.deliveryNotes}
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
