"use client";

import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { FileUp, LoaderCircle, Trash2 } from "lucide-react";
import {
  filterBusinessCategoriesForCapability,
  formatDocumentSize,
  getBusinessCategoryOptionsForCapability,
  isBusinessCategorySelected,
  needsProductsOffered,
  needsServicesOffered,
  PARTNER_CAPABILITY_OPTIONS,
  PARTNER_DOCUMENT_ACCEPT,
  PARTNER_DOCUMENT_MAX_BYTES,
  PARTNER_DOCUMENT_MAX_COUNT,
  submitPartnerApplicationMock,
  toggleBusinessCategory,
  validatePartnerApplication,
  type PartnerBusinessCategoryOption,
} from "@/lib/data/partner-application";
import type {
  PartnerApplicationDocument,
  PartnerApplicationFieldErrors,
  PartnerCapability,
  PartnerSelectedBusinessCategory,
} from "@/types/partner-application";
import { PartnerApplicationSuccess } from "@/components/partners/PartnerApplicationSuccess";

const labelClass =
  "mb-1.5 block font-outfit text-[11px] font-semibold uppercase tracking-wide text-midnight-party/55";

const inputClass =
  "w-full rounded-xl border border-midnight-party/12 bg-[#fbf8fa] px-3.5 py-3 font-outfit text-[14px] text-midnight-party outline-none transition placeholder:text-midnight-party/35 focus:border-lilac-luster/45 focus:bg-white";

const errorTextClass = "mt-1.5 font-outfit text-[12.5px] text-radiant-rose";

type FormState = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  capability: PartnerCapability | "";
  businessCategories: PartnerSelectedBusinessCategory[];
  description: string;
  productsOffered: string;
  servicesOffered: string;
  documents: PartnerApplicationDocument[];
};

const INITIAL_STATE: FormState = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  address: "",
  capability: "",
  businessCategories: [],
  description: "",
  productsOffered: "",
  servicesOffered: "",
  documents: [],
};

export function PartnerApplicationForm() {
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<PartnerApplicationFieldErrors>({});
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    referenceId: string;
    businessName: string;
  } | null>(null);

  const showProducts = needsProductsOffered(form.capability);
  const showServices = needsServicesOffered(form.capability);
  const categoryOptions = getBusinessCategoryOptionsForCapability(
    form.capability,
  );
  const productCategoryOptions = categoryOptions.filter(
    (option) => option.kind === "product",
  );
  const serviceCategoryOptions = categoryOptions.filter(
    (option) => option.kind === "service",
  );

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as keyof PartnerApplicationFieldErrors]) return prev;
      const next = { ...prev };
      delete next[key as keyof PartnerApplicationFieldErrors];
      return next;
    });
  }

  function handleCapabilityChange(value: PartnerCapability) {
    setForm((prev) => ({
      ...prev,
      capability: value,
      businessCategories: filterBusinessCategoriesForCapability(
        prev.businessCategories,
        value,
      ),
      productsOffered:
        value === "service_provider" ? "" : prev.productsOffered,
      servicesOffered: value === "darkstore" ? "" : prev.servicesOffered,
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.capability;
      delete next.businessCategories;
      if (value === "service_provider") delete next.productsOffered;
      if (value === "darkstore") delete next.servicesOffered;
      return next;
    });
  }

  function handleCategoryToggle(option: PartnerBusinessCategoryOption) {
    setForm((prev) => ({
      ...prev,
      businessCategories: toggleBusinessCategory(
        prev.businessCategories,
        option,
      ),
    }));
    setErrors((prev) => {
      if (!prev.businessCategories) return prev;
      const next = { ...prev };
      delete next.businessCategories;
      return next;
    });
  }

  function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;

    setDocumentError(null);
    const remaining = PARTNER_DOCUMENT_MAX_COUNT - form.documents.length;
    if (remaining <= 0) {
      setDocumentError(
        `You can attach up to ${PARTNER_DOCUMENT_MAX_COUNT} supporting documents.`,
      );
      return;
    }

    const accepted: PartnerApplicationDocument[] = [];
    for (const file of files.slice(0, remaining)) {
      if (file.size > PARTNER_DOCUMENT_MAX_BYTES) {
        setDocumentError(
          `"${file.name}" is too large. Max size is ${formatDocumentSize(PARTNER_DOCUMENT_MAX_BYTES)}.`,
        );
        continue;
      }
      accepted.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        sizeBytes: file.size,
      });
    }

    if (accepted.length) {
      setForm((prev) => ({
        ...prev,
        documents: [...prev.documents, ...accepted],
      }));
    }
  }

  function removeDocument(id: string) {
    setForm((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== id),
    }));
    setDocumentError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const draft = {
      businessName: form.businessName,
      contactName: form.contactName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      capability: form.capability,
      businessCategories: filterBusinessCategoriesForCapability(
        form.businessCategories,
        form.capability,
      ),
      description: form.description,
      productsOffered: showProducts ? form.productsOffered : "",
      servicesOffered: showServices ? form.servicesOffered : "",
      documents: form.documents,
    };

    const fieldErrors = validatePartnerApplication(draft);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    const capability = form.capability;
    if (!capability) {
      setErrors({ capability: "Select a partner capability." });
      return;
    }

    setSubmitting(true);
    try {
      const { referenceId } = await submitPartnerApplicationMock({
        ...draft,
        capability,
      });
      setResult({
        referenceId,
        businessName: form.businessName.trim(),
      });
    } catch {
      setSubmitError(
        "We couldn't submit your application right now. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <PartnerApplicationSuccess
        referenceId={result.referenceId}
        businessName={result.businessName}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[1.75rem] border border-midnight-party/10 bg-white p-5 shadow-[8px_8px_0_0_rgba(51,16,56,0.12)] sm:p-7 lg:p-9"
      aria-describedby={submitError ? `${formId}-submit-error` : undefined}
    >
      <div className="mb-6 border-b border-midnight-party/8 pb-5">
        <h2 className="font-oswald text-2xl font-bold uppercase text-midnight-party sm:text-3xl">
          Partner application
        </h2>
        <p className="mt-2 max-w-2xl font-outfit text-sm leading-relaxed text-midnight-party/70 sm:text-base">
          Tell us about your business. This form only starts Operations
          verification. It does not create a partner account or grant login
          access.
        </p>
      </div>

      {submitError ? (
        <div
          id={`${formId}-submit-error`}
          role="alert"
          className="mb-5 rounded-xl border border-radiant-rose/30 bg-radiant-rose/10 px-3.5 py-3 font-outfit text-sm text-midnight-party"
        >
          {submitError}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${formId}-business`}
          label="Business name"
          error={errors.businessName}
          className="sm:col-span-2"
        >
          <input
            id={`${formId}-business`}
            name="businessName"
            type="text"
            autoComplete="organization"
            required
            disabled={submitting}
            value={form.businessName}
            onChange={(e) => updateField("businessName", e.target.value)}
            className={inputClass}
            placeholder="e.g. Accra Night Supplies"
            aria-invalid={Boolean(errors.businessName)}
          />
        </Field>

        <Field
          id={`${formId}-contact`}
          label="Contact person's name"
          error={errors.contactName}
        >
          <input
            id={`${formId}-contact`}
            name="contactName"
            type="text"
            autoComplete="name"
            required
            disabled={submitting}
            value={form.contactName}
            onChange={(e) => updateField("contactName", e.target.value)}
            className={inputClass}
            placeholder="Full name"
            aria-invalid={Boolean(errors.contactName)}
          />
        </Field>

        <Field id={`${formId}-email`} label="Email" error={errors.email}>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            disabled={submitting}
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={inputClass}
            placeholder="business@email.com"
            aria-invalid={Boolean(errors.email)}
          />
        </Field>

        <Field id={`${formId}-phone`} label="Phone number" error={errors.phone}>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            disabled={submitting}
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className={inputClass}
            placeholder="+233 ..."
            aria-invalid={Boolean(errors.phone)}
          />
        </Field>

        <Field
          id={`${formId}-address`}
          label="Business location / address"
          error={errors.address}
          className="sm:col-span-2"
        >
          <input
            id={`${formId}-address`}
            name="address"
            type="text"
            autoComplete="street-address"
            required
            disabled={submitting}
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
            className={inputClass}
            placeholder="City, area, or full address"
            aria-invalid={Boolean(errors.address)}
          />
        </Field>
      </div>

      <fieldset className="mt-6">
        <legend className={labelClass}>Partner capability</legend>
        <div
          className="grid gap-3 sm:grid-cols-3"
          role="radiogroup"
          aria-required="true"
          aria-invalid={Boolean(errors.capability)}
        >
          {PARTNER_CAPABILITY_OPTIONS.map((option) => {
            const selected = form.capability === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer flex-col rounded-2xl border px-4 py-3 transition ${
                  selected
                    ? "border-lilac-luster bg-lilac-luster/8 shadow-[3px_3px_0_0_rgba(109,0,255,0.18)]"
                    : "border-midnight-party/12 bg-[#fbf8fa] hover:border-lilac-luster/35"
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="capability"
                    value={option.value}
                    checked={selected}
                    disabled={submitting}
                    onChange={() => handleCapabilityChange(option.value)}
                    className="h-4 w-4 accent-lilac-luster"
                  />
                  <span className="font-outfit text-sm font-semibold text-midnight-party">
                    {option.label}
                  </span>
                </span>
                <span className="mt-2 font-outfit text-[12.5px] leading-relaxed text-midnight-party/60">
                  {option.hint}
                </span>
              </label>
            );
          })}
        </div>
        {errors.capability ? (
          <p className={errorTextClass} role="alert">
            {errors.capability}
          </p>
        ) : null}
      </fieldset>

      <fieldset className="mt-6">
        <legend className={labelClass}>Business category</legend>
        {!form.capability ? (
          <p className="rounded-2xl border border-dashed border-midnight-party/15 bg-[#fbf8fa] px-4 py-3 font-outfit text-[13px] text-midnight-party/55">
            Select a partner capability first to choose relevant categories.
          </p>
        ) : (
          <div
            className="space-y-4"
            role="group"
            aria-required="true"
            aria-invalid={Boolean(errors.businessCategories)}
          >
            <p className="font-outfit text-[12.5px] leading-relaxed text-midnight-party/60">
              Select all categories that apply. Options update when you change
              capability.
            </p>
            {productCategoryOptions.length > 0 ? (
              <CategoryOptionGroup
                title="Product categories"
                options={productCategoryOptions}
                selected={form.businessCategories}
                disabled={submitting}
                onToggle={handleCategoryToggle}
              />
            ) : null}
            {serviceCategoryOptions.length > 0 ? (
              <CategoryOptionGroup
                title="Service categories"
                options={serviceCategoryOptions}
                selected={form.businessCategories}
                disabled={submitting}
                onToggle={handleCategoryToggle}
              />
            ) : null}
          </div>
        )}
        {errors.businessCategories ? (
          <p className={errorTextClass} role="alert">
            {errors.businessCategories}
          </p>
        ) : null}
      </fieldset>

      <div className="mt-6 grid gap-5">
        <Field
          id={`${formId}-description`}
          label="Business description"
          error={errors.description}
        >
          <textarea
            id={`${formId}-description`}
            name="description"
            required
            rows={4}
            disabled={submitting}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className={`${inputClass} resize-y min-h-[7rem]`}
            placeholder="What do you do, who do you serve, and why Party Wagon?"
            aria-invalid={Boolean(errors.description)}
          />
        </Field>

        {showProducts ? (
          <Field
            id={`${formId}-products`}
            label="Products offered"
            error={errors.productsOffered}
          >
            <textarea
              id={`${formId}-products`}
              name="productsOffered"
              required
              rows={3}
              disabled={submitting}
              value={form.productsOffered}
              onChange={(e) => updateField("productsOffered", e.target.value)}
              className={`${inputClass} resize-y min-h-[5.5rem]`}
              placeholder="e.g. beers, soft drinks, party platters, ice…"
              aria-invalid={Boolean(errors.productsOffered)}
            />
          </Field>
        ) : null}

        {showServices ? (
          <Field
            id={`${formId}-services`}
            label="Services offered"
            error={errors.servicesOffered}
          >
            <textarea
              id={`${formId}-services`}
              name="servicesOffered"
              required
              rows={3}
              disabled={submitting}
              value={form.servicesOffered}
              onChange={(e) => updateField("servicesOffered", e.target.value)}
              className={`${inputClass} resize-y min-h-[5.5rem]`}
              placeholder="e.g. DJ packages, catering, mobile bar…"
              aria-invalid={Boolean(errors.servicesOffered)}
            />
          </Field>
        ) : null}
      </div>

      <div className="mt-6">
        <p className={labelClass}>
          Supporting documents{" "}
          <span className="normal-case tracking-normal text-midnight-party/40">
            (optional)
          </span>
        </p>
        <div className="rounded-2xl border border-dashed border-midnight-party/15 bg-[#fbf8fa] px-4 py-5">
          <input
            ref={fileInputRef}
            id={`${formId}-documents`}
            type="file"
            multiple
            accept={PARTNER_DOCUMENT_ACCEPT}
            className="sr-only"
            disabled={submitting}
            onChange={handleFilesSelected}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-outfit text-sm font-semibold text-midnight-party">
                Attach licences, menus, or brochures
              </p>
              <p className="mt-1 font-outfit text-[12.5px] text-midnight-party/55">
                PDF, DOC/DOCX, or images · max{" "}
                {formatDocumentSize(PARTNER_DOCUMENT_MAX_BYTES)} each · up to{" "}
                {PARTNER_DOCUMENT_MAX_COUNT} files. Files stay on this device for
                this mock submission.
              </p>
            </div>
            <button
              type="button"
              disabled={submitting}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-midnight-party px-4 py-2.5 font-outfit text-[12.5px] font-semibold uppercase tracking-wide text-white transition hover:bg-lilac-luster disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileUp size={15} aria-hidden="true" />
              Add files
            </button>
          </div>

          {form.documents.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {form.documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-midnight-party/8 bg-white px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-outfit text-[13px] font-semibold text-midnight-party">
                      {doc.name}
                    </p>
                    <p className="font-outfit text-[11.5px] text-midnight-party/50">
                      {formatDocumentSize(doc.sizeBytes)}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => removeDocument(doc.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-midnight-party/12 px-3 py-1.5 font-outfit text-[12px] font-semibold text-radiant-rose transition hover:border-radiant-rose/40 hover:bg-radiant-rose/8 disabled:opacity-50"
                    aria-label={`Remove ${doc.name}`}
                  >
                    <Trash2 size={13} aria-hidden="true" />
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {documentError ? (
            <p className={errorTextClass} role="alert">
              {documentError}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-midnight-party/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md font-outfit text-[12.5px] leading-relaxed text-midnight-party/60">
          By submitting, you confirm the details are accurate. Approval and
          account creation happen only after Operations verification.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-lemon-twist px-6 py-3 font-outfit text-sm font-semibold uppercase tracking-wide text-midnight-party shadow-[5px_5px_0_0_rgba(51,16,56,0.35)] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lilac-luster disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          {submitting ? (
            <>
              <LoaderCircle
                size={18}
                className="animate-spin"
                aria-hidden="true"
              />
              Submitting…
            </>
          ) : (
            "Submit application"
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div aria-describedby={error ? errorId : undefined}>{children}</div>
      {error ? (
        <p id={errorId} className={errorTextClass} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function CategoryOptionGroup({
  title,
  options,
  selected,
  disabled,
  onToggle,
}: {
  title: string;
  options: PartnerBusinessCategoryOption[];
  selected: PartnerSelectedBusinessCategory[];
  disabled: boolean;
  onToggle: (option: PartnerBusinessCategoryOption) => void;
}) {
  return (
    <div>
      <p className="mb-2 font-outfit text-[11px] font-semibold uppercase tracking-wide text-lilac-luster">
        {title}
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => {
          const checked = isBusinessCategorySelected(selected, option);
          return (
            <label
              key={option.key}
              className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition ${
                checked
                  ? "border-lilac-luster bg-lilac-luster/8"
                  : "border-midnight-party/12 bg-[#fbf8fa] hover:border-lilac-luster/35"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => onToggle(option)}
                className="h-4 w-4 accent-lilac-luster"
              />
              <span className="font-outfit text-[13px] font-medium text-midnight-party">
                {option.name}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
