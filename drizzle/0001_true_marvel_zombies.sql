CREATE TABLE "zaposleni" (
	"id" serial PRIMARY KEY NOT NULL,
	"ime" varchar(100) NOT NULL,
	"prezime" varchar(100) NOT NULL,
	"datum_rodjenja" date NOT NULL,
	"pozicija" varchar(150) NOT NULL,
	"plata" numeric(10, 2) NOT NULL,
	"datum_zaposlenja" date NOT NULL,
	"status_zaposlenja" boolean DEFAULT true NOT NULL,
	"korisnik_id" integer NOT NULL,
	CONSTRAINT "zaposleni_korisnik_id_unique" UNIQUE("korisnik_id")
);
--> statement-breakpoint
ALTER TABLE "zaposleni" ADD CONSTRAINT "zaposleni_korisnik_id_korisnik_id_fk" FOREIGN KEY ("korisnik_id") REFERENCES "public"."korisnik"("id") ON DELETE restrict ON UPDATE cascade;