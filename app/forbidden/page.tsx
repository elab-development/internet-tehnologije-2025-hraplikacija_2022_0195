import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pristup odbijen</h1>
      <p className="mb-4">Nemate dozvolu da pristupite ovom delu sajta.</p>
      <Link href="/">Nazad na početnu</Link>
    </div>
  );
}
