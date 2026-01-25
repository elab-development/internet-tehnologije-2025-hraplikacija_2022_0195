CREATE TABLE "uloga_korisnika" (
	"id" serial PRIMARY KEY NOT NULL,
	"naziv" varchar(50) NOT NULL,
	CONSTRAINT "uloga_korisnika_naziv_unique" UNIQUE("naziv")
);
--> statement-breakpoint
CREATE TABLE "korisnik" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"lozinka_hash" varchar(255) NOT NULL,
	"status_naloga" boolean DEFAULT true NOT NULL,
	"uloga_id" integer NOT NULL,
	CONSTRAINT "korisnik_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "korisnik" ADD CONSTRAINT "korisnik_uloga_id_uloga_korisnika_id_fk" FOREIGN KEY ("uloga_id") REFERENCES "public"."uloga_korisnika"("id") ON DELETE restrict ON UPDATE cascade;