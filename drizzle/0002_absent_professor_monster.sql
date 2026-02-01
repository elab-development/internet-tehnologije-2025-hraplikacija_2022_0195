CREATE TABLE "status_zahteva" (
	"id" serial PRIMARY KEY NOT NULL,
	"naziv" varchar(50) NOT NULL,
	CONSTRAINT "status_zahteva_naziv_unique" UNIQUE("naziv")
);
--> statement-breakpoint
CREATE TABLE "zahtev_za_odsustvo" (
	"id" serial PRIMARY KEY NOT NULL,
	"zaposleni_id" integer NOT NULL,
	"status_id" integer NOT NULL,
	"datum_od" date NOT NULL,
	"datum_do" date NOT NULL,
	"razlog" varchar(500) NOT NULL,
	"datum_kreiranja" timestamp DEFAULT now() NOT NULL,
	"datum_azuriranja" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "zahtev_za_odsustvo" ADD CONSTRAINT "zahtev_za_odsustvo_zaposleni_id_zaposleni_id_fk" FOREIGN KEY ("zaposleni_id") REFERENCES "public"."zaposleni"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "zahtev_za_odsustvo" ADD CONSTRAINT "zahtev_za_odsustvo_status_id_status_zahteva_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."status_zahteva"("id") ON DELETE restrict ON UPDATE cascade;