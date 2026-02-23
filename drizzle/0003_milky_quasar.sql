CREATE TABLE "ocena_rada" (
	"id" serial PRIMARY KEY NOT NULL,
	"autor_id" integer NOT NULL,
	"ocenjeni_id" integer NOT NULL,
	"datum_od" date NOT NULL,
	"datum_do" date NOT NULL,
	"ocena" integer NOT NULL,
	"komentar" varchar(1000),
	"datum_kreiranja" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ocena_rada" ADD CONSTRAINT "ocena_rada_autor_id_zaposleni_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."zaposleni"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ocena_rada" ADD CONSTRAINT "ocena_rada_ocenjeni_id_zaposleni_id_fk" FOREIGN KEY ("ocenjeni_id") REFERENCES "public"."zaposleni"("id") ON DELETE restrict ON UPDATE cascade;