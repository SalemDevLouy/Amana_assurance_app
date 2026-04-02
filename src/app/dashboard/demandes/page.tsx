
        "use client";

        import { useMemo, useState } from "react";
        import { useSession } from "next-auth/react";
        import {
          FaCalendarAlt,
          FaCheckCircle,
          FaClock,
          FaExclamationTriangle,
          FaFileAlt,
          FaMapMarkerAlt,
          FaPhone,
          FaSearch,
          FaShieldAlt,
          FaTimesCircle,
          FaUser,
        } from "react-icons/fa";

        type DemandStatus = "EN_ATTENTE" | "EN_REVUE" | "ACCEPTEE" | "REFUSEE";

        type Attachment = {
          id: string;
          name: string;
          kind: "Photo" | "Video" | "Document";
          size: string;
        };

        type AccidentDemand = {
          id: string;
          caseNumber: string;
          status: DemandStatus;
          priority: "Haute" | "Moyenne" | "Basse";
          submittedAt: string;
          updatedAt: string;
          requester: {
            name: string;
            email: string;
            phone: string;
            role: string;
          };
          demand: {
            type: string;
            source: string;
            policyNumber: string;
            coverage: string;
            summary: string;
            notes: string;
          };
          accident: {
            dateTime: string;
            location: string;
            vehiclePlate: string;
            weather: string;
            injuries: string;
            policeReportNumber: string;
            witnesses: string;
            description: string;
          };
          attachments: Attachment[];
          internalNotes: string[];
        };

        const STATUS_META: Record<DemandStatus, { label: string; tone: string; description: string }> = {
          EN_ATTENTE: {
            label: "En attente",
            tone: "border-amber-300 bg-amber-50 text-amber-700",
            description: "En attente de premiere revue",
          },
          EN_REVUE: {
            label: "En revue",
            tone: "border-blue-300 bg-blue-50 text-blue-700",
            description: "En cours d'analyse par l'equipe",
          },
          ACCEPTEE: {
            label: "Acceptée",
            tone: "border-emerald-300 bg-emerald-50 text-emerald-700",
            description: "Demande validée et prête au traitement",
          },
          REFUSEE: {
            label: "Refusée",
            tone: "border-rose-300 bg-rose-50 text-rose-700",
            description: "Demande clôturée avec refus",
          },
        };

        const PRIORITY_META: Record<AccidentDemand["priority"], string> = {
          Haute: "border-rose-300 bg-rose-50 text-rose-700",
          Moyenne: "border-amber-300 bg-amber-50 text-amber-700",
          Basse: "border-slate-300 bg-slate-100 text-slate-700",
        };

        const statusOrder: DemandStatus[] = ["EN_ATTENTE", "EN_REVUE", "ACCEPTEE", "REFUSEE"];

        const initialDemands: AccidentDemand[] = [
          {
            id: "dmd-001",
            caseNumber: "ACC-2026-0142",
            status: "EN_ATTENTE",
            priority: "Haute",
            submittedAt: "01/04/2026 09:24",
            updatedAt: "01/04/2026 09:24",
            requester: {
              name: "Amine B.",
              email: "amine@example.com",
              phone: "+213 770 000 101",
              role: "Client assuré",
            },
            demand: {
              type: "Déclaration d'accident",
              source: "Formulaire mobile",
              policyNumber: "POL-AL-88421",
              coverage: "Automobile tous risques",
              summary: "Collision arrière sur route urbaine avec dégâts au pare-chocs et au coffre.",
              notes: "Le dossier a été transmis avec photos, constat et numéro de procès-verbal.",
            },
            accident: {
              dateTime: "31/03/2026 18:40",
              location: "Alger, Bab Ezzouar, Rue Mohamed Boudiaf",
              vehiclePlate: "16-184-229",
              weather: "Ciel dégagé, route sèche",
              injuries: "Aucune blessure déclarée",
              policeReportNumber: "PV-2026-77821",
              witnesses: "Mohamed S. - 0550 112 233",
              description:
                "Le véhicule du client a été heurté par l'arrière à faible vitesse lors d'un ralentissement soudain du trafic.",
            },
            attachments: [
              { id: "att-1", name: "photo-avant.jpg", kind: "Photo", size: "2.1 MB" },
              { id: "att-2", name: "photo-arriere.jpg", kind: "Photo", size: "1.8 MB" },
              { id: "att-3", name: "constat.pdf", kind: "Document", size: "640 KB" },
            ],
            internalNotes: [
              "Vérifier la cohérence entre les dégâts visibles et la description.",
              "Demander confirmation du devis de réparation si le plafond est dépassé.",
            ],
          },
          {
            id: "dmd-002",
            caseNumber: "ACC-2026-0133",
            status: "EN_REVUE",
            priority: "Moyenne",
            submittedAt: "31/03/2026 16:05",
            updatedAt: "31/03/2026 18:12",
            requester: {
              name: "Sofia L.",
              email: "sofia@example.com",
              phone: "+213 770 000 202",
              role: "Client assuré",
            },
            demand: {
              type: "Déclaration d'accident",
              source: "Espace client",
              policyNumber: "POL-AL-77102",
              coverage: "Automobile intermédiaire",
              summary: "Accrochage latéral dans un rond-point avec échange d'informations entre conducteurs.",
              notes: "Le dossier est exploitable mais la photo du permis est floue.",
            },
            accident: {
              dateTime: "31/03/2026 15:20",
              location: "Oran, Bir El Djir, rond-point principal",
              vehiclePlate: "31-417-088",
              weather: "Temps couvert, chaussée humide",
              injuries: "Blessure légère au poignet signalée",
              policeReportNumber: "PV non encore fourni",
              witnesses: "Aucun témoin identifié",
              description:
                "Le véhicule a été heurté sur le côté gauche au moment de l'insertion dans le rond-point.",
            },
            attachments: [
              { id: "att-4", name: "photo-cote.jpg", kind: "Photo", size: "1.3 MB" },
              { id: "att-5", name: "video-scene.mp4", kind: "Video", size: "8.9 MB" },
              { id: "att-6", name: "piece-identite.pdf", kind: "Document", size: "512 KB" },
            ],
            internalNotes: [
              "Relancer pour le numéro de procès-verbal.",
              "Vérifier la déclaration de blessure avant validation finale.",
            ],
          },
          {
            id: "dmd-003",
            caseNumber: "ACC-2026-0119",
            status: "ACCEPTEE",
            priority: "Basse",
            submittedAt: "30/03/2026 11:48",
            updatedAt: "31/03/2026 09:10",
            requester: {
              name: "Yacine M.",
              email: "yacine@example.com",
              phone: "+213 770 000 303",
              role: "Client assuré",
            },
            demand: {
              type: "Déclaration d'accident",
              source: "Application web",
              policyNumber: "POL-AL-66318",
              coverage: "Auto + assistance",
              summary: "Déclaration complète avec constat, témoignage et pièces justificatives lisibles.",
              notes: "Acceptée pour traitement indemnisation après contrôle administratif.",
            },
            accident: {
              dateTime: "29/03/2026 20:55",
              location: "Setif, Route nationale 5",
              vehiclePlate: "19-305-441",
              weather: "Nuit, visibilité moyenne",
              injuries: "Aucune blessure",
              policeReportNumber: "PV-2026-66390",
              witnesses: "Khaled R. - 0770 121 212",
              description:
                "Sortie de voie avec choc sur glissière, dommages essentiellement matériels et pas de tiers impliqué.",
            },
            attachments: [
              { id: "att-7", name: "constat-signe.pdf", kind: "Document", size: "1.2 MB" },
              { id: "att-8", name: "photos.zip", kind: "Photo", size: "12.4 MB" },
            ],
            internalNotes: [
              "Dossier complet, aucune pièce manquante.",
              "Indemnisation validée et transmise au service sinistres.",
            ],
          },
          {
            id: "dmd-004",
            caseNumber: "ACC-2026-0098",
            status: "REFUSEE",
            priority: "Moyenne",
            submittedAt: "28/03/2026 13:32",
            updatedAt: "29/03/2026 10:14",
            requester: {
              name: "Nadia K.",
              email: "nadia@example.com",
              phone: "+213 770 000 404",
              role: "Client assuré",
            },
            demand: {
              type: "Déclaration d'accident",
              source: "Portail client",
              policyNumber: "POL-AL-55011",
              coverage: "Agricole",
              summary: "Demande refusée pour incohérences majeures entre date, lieu et pièces jointes.",
              notes: "Refus motivé envoyé au client avec demande de nouvelle déclaration.",
            },
            accident: {
              dateTime: "27/03/2026 08:15",
              location: "Blida, périphérie agricole",
              vehiclePlate: "09-002-778",
              weather: "Brouillard dense",
              injuries: "Non précisé",
              policeReportNumber: "Aucun document exploitable",
              witnesses: "Non renseigné",
              description:
                "La déclaration ne permettait pas de vérifier le lieu exact ni le véhicule concerné.",
            },
            attachments: [
              { id: "att-9", name: "image-floue.jpg", kind: "Photo", size: "420 KB" },
              { id: "att-10", name: "document-incomplet.pdf", kind: "Document", size: "280 KB" },
            ],
            internalNotes: [
              "Pièces insuffisantes et contradictions dans le récit.",
              "Dossier clos avec refus et consigne de compléter les preuves.",
            ],
          },
        ];

        export default function Page() {
          const { data: session, status } = useSession();
          const [demands, setDemands] = useState<AccidentDemand[]>(initialDemands);
          const [selectedId, setSelectedId] = useState(initialDemands[0]?.id ?? "");
          const [search, setSearch] = useState("");
          const [statusFilter, setStatusFilter] = useState<DemandStatus | "ALL">("ALL");
          const [actionMessage, setActionMessage] = useState<string | null>(null);
          const [internalNote, setInternalNote] = useState("");

          const isAdmin = status === "authenticated" && session?.user?.role === "ADMIN";

          const filteredDemands = useMemo(() => {
            const query = search.trim().toLowerCase();

            return demands.filter((demand) => {
              const matchesStatus = statusFilter === "ALL" ? true : demand.status === statusFilter;
              const haystack = [
                demand.caseNumber,
                demand.requester.name,
                demand.requester.email,
                demand.requester.phone,
                demand.demand.type,
                demand.demand.policyNumber,
                demand.demand.coverage,
                demand.accident.location,
                demand.accident.vehiclePlate,
                demand.accident.policeReportNumber,
              ]
                .join(" ")
                .toLowerCase();

              const matchesQuery = query.length === 0 || haystack.includes(query);

              return matchesStatus && matchesQuery;
            });
          }, [demands, search, statusFilter]);

          const selectedDemand = useMemo(
            () => filteredDemands.find((item) => item.id === selectedId) ?? filteredDemands[0] ?? null,
            [filteredDemands, selectedId]
          );

          const summary = useMemo(() => {
            const total = demands.length;
            const waiting = demands.filter((item) => item.status === "EN_ATTENTE").length;
            const inReview = demands.filter((item) => item.status === "EN_REVUE").length;
            const processed = demands.filter(
              (item) => item.status === "ACCEPTEE" || item.status === "REFUSEE"
            ).length;

            return { total, waiting, inReview, processed };
          }, [demands]);

          const updateDemandStatus = (demandId: string, nextStatus: DemandStatus, note: string) => {
            setDemands((current) =>
              current.map((item) =>
                item.id === demandId
                  ? {
                      ...item,
                      status: nextStatus,
                      updatedAt: new Date().toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                      internalNotes: [note, ...item.internalNotes],
                    }
                  : item
              )
            );

            setActionMessage(note);
          };

          const handleAddNote = () => {
            if (!selectedDemand || internalNote.trim().length === 0) {
              return;
            }

            setDemands((current) =>
              current.map((item) =>
                item.id === selectedDemand.id
                  ? {
                      ...item,
                      updatedAt: new Date().toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                      internalNotes: [internalNote.trim(), ...item.internalNotes],
                    }
                  : item
              )
            );

            setActionMessage("Note interne ajoutée au dossier.");
            setInternalNote("");
          };

          const handleAccept = () => {
            if (!selectedDemand) {
              return;
            }

            updateDemandStatus(
              selectedDemand.id,
              "ACCEPTEE",
              "Demande acceptée et envoyée au circuit de traitement."
            );
          };

          const handleRefuse = () => {
            if (!selectedDemand) {
              return;
            }

            updateDemandStatus(
              selectedDemand.id,
              "REFUSEE",
              "Demande refusée après revue des pièces et du dossier accident."
            );
          };

          const handleMoveToReview = () => {
            if (!selectedDemand) {
              return;
            }

            updateDemandStatus(
              selectedDemand.id,
              "EN_REVUE",
              "Demande placée en revue pour analyse complémentaire."
            );
          };

          if (status === "loading") {
            return (
              <div className="relative z-10 mx-auto my-24 max-w-7xl rounded-3xl border border-cyan-400/30 bg-white/80 p-8 shadow-xl">
                Chargement des demandes...
              </div>
            );
          }

          if (!isAdmin) {
            return (
              <div className="relative z-10 mx-auto my-24 max-w-4xl rounded-3xl border border-red-200 bg-white/90 p-8 text-red-700 shadow-xl">
                Acces refuse. Cette page est reservee aux administrateurs.
              </div>
            );
          }

          if (!selectedDemand) {
            return (
              <div className="relative z-10 mx-auto my-24 max-w-4xl rounded-3xl border border-slate-200 bg-white/90 p-8 text-slate-700 shadow-xl">
                Aucune demande disponible.
              </div>
            );
          }

          return (
            <div className="relative z-10 mx-auto my-10 flex max-w-7xl flex-col gap-6 px-4 py-4 md:my-16 md:px-6">
              <section
                className="rounded-3xl border border-cyan-500/30 p-6 text-white shadow-2xl md:p-8"
                style={{
                  backgroundImage: "linear-gradient(135deg, #020617 0%, #0f172a 55%, #1e293b 100%)",
                }}
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                      <FaShieldAlt /> Gestion des demandes
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                      Processer les déclarations d'accident depuis un seul écran.
                    </h1>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
                      Consultez chaque demande, lisez les details d'accident, ajoutez des notes internes et
                      acceptez ou refusez le dossier selon la qualité des pièces reçues.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur md:grid-cols-4">
                    <StatCard label="Total" value={summary.total.toString()} helper="Demandes reçues" />
                    <StatCard label="Attente" value={summary.waiting.toString()} helper="A traiter" />
                    <StatCard label="Revue" value={summary.inReview.toString()} helper="En cours" />
                    <StatCard label="Traitées" value={summary.processed.toString()} helper="Finalisées" />
                  </div>
                </div>
              </section>

              {actionMessage ? (
                <p className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
                  {actionMessage}
                </p>
              ) : null}

              <section className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
                <aside className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl md:p-6">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">File des demandes</h2>
                      <p className="mt-1 text-sm text-slate-500">Filtrez et ouvrez un dossier.</p>
                    </div>

                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 shadow-sm focus-within:border-cyan-400 focus-within:bg-white">
                      <FaSearch className="shrink-0 text-cyan-600" />
                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Rechercher par nom, police, lieu..."
                        className="w-full bg-transparent text-sm outline-none"
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <FilterButton label="Toutes" active={statusFilter === "ALL"} onClick={() => setStatusFilter("ALL")} />
                      {statusOrder.map((statusValue) => {
                        const meta = STATUS_META[statusValue];

                        return (
                          <FilterButton
                            key={statusValue}
                            label={meta.label}
                            active={statusFilter === statusValue}
                            onClick={() => setStatusFilter(statusValue)}
                          />
                        );
                      })}
                    </div>

                    <div className="space-y-3">
                      {filteredDemands.map((demand) => {
                        const isSelected = demand.id === selectedDemand.id;

                        return (
                          <button
                            key={demand.id}
                            type="button"
                            onClick={() => setSelectedId(demand.id)}
                            className={`w-full rounded-2xl border p-4 text-left transition ${
                              isSelected
                                ? "border-cyan-400 bg-cyan-50 shadow-md"
                                : "border-slate-200 bg-white hover:border-cyan-200 hover:bg-cyan-50/40"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-bold text-slate-900">{demand.caseNumber}</p>
                                <p className="mt-1 text-xs text-slate-500">{demand.requester.name}</p>
                              </div>
                              <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${STATUS_META[demand.status].tone}`}>
                                {STATUS_META[demand.status].label}
                              </span>
                            </div>

                            <div className="mt-3 space-y-2 text-xs text-slate-600">
                              <p className="flex items-center gap-2">
                                <FaCalendarAlt className="text-cyan-600" />
                                {demand.submittedAt}
                              </p>
                              <p className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-cyan-600" />
                                {demand.accident.location}
                              </p>
                              <p className="flex items-center gap-2">
                                <FaUser className="text-cyan-600" />
                                {demand.demand.type}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </aside>

                <main className="space-y-6">
                  <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl md:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-2xl font-black text-slate-900">{selectedDemand.caseNumber}</h2>
                          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_META[selectedDemand.status].tone}`}>
                            {STATUS_META[selectedDemand.status].label}
                          </span>
                          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${PRIORITY_META[selectedDemand.priority]}`}>
                            Priorité {selectedDemand.priority}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          {STATUS_META[selectedDemand.status].description} - dernière mise à jour {selectedDemand.updatedAt}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <ActionButton onClick={handleMoveToReview} tone="outline">
                          Mettre en revue
                        </ActionButton>
                        <ActionButton onClick={handleAccept} tone="success">
                          <FaCheckCircle /> Accepter
                        </ActionButton>
                        <ActionButton onClick={handleRefuse} tone="danger">
                          <FaTimesCircle /> Refuser
                        </ActionButton>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <InfoTile label="Demandeur" value={selectedDemand.requester.name} icon={<FaUser />} />
                      <InfoTile label="Téléphone" value={selectedDemand.requester.phone} icon={<FaPhone />} />
                      <InfoTile label="Police" value={selectedDemand.demand.policyNumber} icon={<FaFileAlt />} />
                      <InfoTile label="Garantie" value={selectedDemand.demand.coverage} icon={<FaShieldAlt />} />
                    </div>
                  </section>

                  <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <Panel title="Détails de la demande" icon={<FaFileAlt />}>
                      <DetailRow label="Type" value={selectedDemand.demand.type} />
                      <DetailRow label="Source" value={selectedDemand.demand.source} />
                      <DetailRow label="Résumé" value={selectedDemand.demand.summary} />
                      <DetailRow label="Observations internes" value={selectedDemand.demand.notes} />
                      <DetailRow label="Date de soumission" value={selectedDemand.submittedAt} />
                      <DetailRow label="Dernière mise à jour" value={selectedDemand.updatedAt} />
                    </Panel>

                    <Panel title="Profil du demandeur" icon={<FaUser />}>
                      <DetailRow label="Nom" value={selectedDemand.requester.name} />
                      <DetailRow label="Email" value={selectedDemand.requester.email} />
                      <DetailRow label="Téléphone" value={selectedDemand.requester.phone} />
                      <DetailRow label="Rôle" value={selectedDemand.requester.role} />
                      <DetailRow label="Canal" value={selectedDemand.demand.source} />
                    </Panel>
                  </section>

                  <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl md:p-6">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
                        <FaExclamationTriangle />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Détails de l'accident</h3>
                        <p className="text-sm text-slate-500">Informations déclarées pour l'analyse du sinistre.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <DetailRow label="Date et heure" value={selectedDemand.accident.dateTime} />
                      <DetailRow label="Lieu" value={selectedDemand.accident.location} />
                      <DetailRow label="Plaque" value={selectedDemand.accident.vehiclePlate} />
                      <DetailRow label="Météo" value={selectedDemand.accident.weather} />
                      <DetailRow label="Blessures" value={selectedDemand.accident.injuries} />
                      <DetailRow label="PV police" value={selectedDemand.accident.policeReportNumber} />
                      <DetailRow label="Témoins" value={selectedDemand.accident.witnesses} />
                      <DetailRow label="Description" value={selectedDemand.accident.description} />
                    </div>
                  </section>

                  <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <Panel title="Pièces jointes" icon={<FaFileAlt />}>
                      <div className="space-y-3">
                        {selectedDemand.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                          >
                            <div>
                              <p className="font-semibold text-slate-900">{attachment.name}</p>
                              <p className="text-xs text-slate-500">
                                {attachment.kind} - {attachment.size}
                              </p>
                            </div>
                            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-700">
                              {attachment.kind}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Panel>

                    <Panel title="Notes internes" icon={<FaClock />}>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <FaCheckCircle className="mt-0.5 text-cyan-600" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Ajouter une note</p>
                            <textarea
                              value={internalNote}
                              onChange={(event) => setInternalNote(event.target.value)}
                              placeholder="Ex: demande des pièces complémentaires, vérification du PV..."
                              className="mt-2 min-h-28 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500"
                            />
                            <div className="mt-3 flex justify-end">
                              <button
                                type="button"
                                onClick={handleAddNote}
                                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                              >
                                Enregistrer la note
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {selectedDemand.internalNotes.map((note, index) => (
                            <div
                              key={`${selectedDemand.id}-note-${index}`}
                              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600"
                            >
                              {note}
                            </div>
                          ))}
                        </div>
                      </div>
                    </Panel>
                  </section>
                </main>
              </section>
            </div>
          );
        }

        function StatCard({
          label,
          value,
          helper,
        }: Readonly<{
          label: string;
          value: string;
          helper: string;
        }>) {
          return (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300">{label}</p>
              <p className="mt-2 text-2xl font-black text-white">{value}</p>
              <p className="mt-1 text-xs text-slate-400">{helper}</p>
            </div>
          );
        }

        function FilterButton({
          label,
          active,
          onClick,
        }: Readonly<{
          label: string;
          active: boolean;
          onClick: () => void;
        }>) {
          return (
            <button
              type="button"
              onClick={onClick}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                active
                  ? "border-cyan-300 bg-cyan-50 text-cyan-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          );
        }

        function ActionButton({
          children,
          onClick,
          tone,
        }: Readonly<{
          children: React.ReactNode;
          onClick: () => void;
          tone: "outline" | "success" | "danger";
        }>) {
          let toneClass = "border-slate-300 bg-white text-slate-700 hover:bg-slate-50";

          if (tone === "success") {
            toneClass = "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100";
          }

          if (tone === "danger") {
            toneClass = "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100";
          }

          return (
            <button
              type="button"
              onClick={onClick}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${toneClass}`}
            >
              {children}
            </button>
          );
        }

        function Panel({
          title,
          icon,
          children,
        }: Readonly<{
          title: string;
          icon: React.ReactNode;
          children: React.ReactNode;
        }>) {
          return (
            <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl md:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">{icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                </div>
              </div>
              {children}
            </section>
          );
        }

        function InfoTile({
          label,
          value,
          icon,
        }: Readonly<{
          label: string;
          value: string;
          icon: React.ReactNode;
        }>) {
          return (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {icon}
                {label}
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
            </div>
          );
        }

        function DetailRow({
          label,
          value,
        }: Readonly<{
          label: string;
          value: string;
        }>) {
          return (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-800">{value}</p>
            </div>
          );
        }
