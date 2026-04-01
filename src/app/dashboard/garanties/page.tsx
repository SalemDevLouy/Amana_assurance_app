"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Card, Input, Modal } from "@heroui/react";

type AssuranceFilter = "car" | "farmer";
type InputType = "checkbox" | "selectgroup";

type GuaranteeOption = {
  id: string;
  key: string;
  label: string;
  price: number;
};

type GuaranteeGroup = {
  id: string;
  key: string;
  title: string;
  description?: string;
  inputType: InputType;
  mandatory: boolean;
  options: GuaranteeOption[];
};

type GuaranteeRow = {
  optionId: string;
  optionKey: string;
  optionLabel: string;
  optionPrice: number;
  groupTitle: string;
  groupInputType: InputType;
  mandatory: boolean;
};

type GroupRow = {
  groupId: string;
  groupKey: string;
  groupTitle: string;
  inputType: InputType;
  mandatory: boolean;
  optionCount: number;
};

type EditingRow = {
  optionId: string;
  key: string;
  label: string;
  price: string;
};

type EditingGroup = {
  groupId: string;
  key: string;
  title: string;
  description: string;
  inputType: InputType;
  mandatory: boolean;
};

type NewOptionForm = {
  groupId: string;
  key: string;
  label: string;
  price: string;
};

type NewGroupForm = {
  key: string;
  title: string;
  description: string;
  inputType: InputType;
  mandatory: boolean;
};

function buildRows(groups: GuaranteeGroup[]): GuaranteeRow[] {
  return groups.flatMap((group) =>
    group.options.map((option) => ({
      optionId: option.id,
      optionKey: option.key,
      optionLabel: option.label,
      optionPrice: option.price,
      groupTitle: group.title,
      groupInputType: group.inputType,
      mandatory: group.mandatory,
    }))
  );
}

function buildGroupRows(groups: GuaranteeGroup[]): GroupRow[] {
  return groups.map((group) => ({
    groupId: group.id,
    groupKey: group.key,
    groupTitle: group.title,
    inputType: group.inputType,
    mandatory: group.mandatory,
    optionCount: group.options.length,
  }));
}

function updateOptionInGroups(groups: GuaranteeGroup[], editingRow: EditingRow, parsedPrice: number) {
  return groups.map((group) => ({
    ...group,
    options: group.options.map((option) =>
      option.id === editingRow.optionId
        ? {
            ...option,
            key: editingRow.key,
            label: editingRow.label,
            price: Math.trunc(parsedPrice),
          }
        : option
    ),
  }));
}

function removeOptionFromGroups(groups: GuaranteeGroup[], optionId: string) {
  return groups
    .map((group) => ({
      ...group,
      options: group.options.filter((option) => option.id !== optionId),
    }))
    .filter((group) => group.options.length > 0);
}

function updateGroupInGroups(groups: GuaranteeGroup[], editingGroup: EditingGroup) {
  return groups.map((group) =>
    group.id === editingGroup.groupId
      ? {
          ...group,
          key: editingGroup.key,
          title: editingGroup.title,
          description: editingGroup.description,
          inputType: editingGroup.inputType,
          mandatory: editingGroup.mandatory,
        }
      : group
  );
}

function removeGroupFromGroups(groups: GuaranteeGroup[], groupId: string) {
  return groups.filter((group) => group.id !== groupId);
}

function addOptionToGroups(groups: GuaranteeGroup[], groupId: string, option: GuaranteeOption) {
  return groups.map((group) =>
    group.id === groupId
      ? {
          ...group,
          options: [...group.options, option],
        }
      : group
  );
}

function addGroupToGroups(groups: GuaranteeGroup[], group: GuaranteeGroup) {
  return [...groups, group];
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function GuaranteesDashboardPage() {
  const { data: session, status } = useSession();

  const [assuranceType, setAssuranceType] = useState<AssuranceFilter>("car");
  const [activeTab, setActiveTab] = useState<"options" | "groups">("options");
  const [groups, setGroups] = useState<GuaranteeGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [editingRow, setEditingRow] = useState<EditingRow | null>(null);
  const [deletingRow, setDeletingRow] = useState<GuaranteeRow | null>(null);
  const [editingGroup, setEditingGroup] = useState<EditingGroup | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<GroupRow | null>(null);
  const [isAddOptionOpen, setIsAddOptionOpen] = useState(false);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [newOption, setNewOption] = useState<NewOptionForm>({
    groupId: "",
    key: "",
    label: "",
    price: "0",
  });
  const [newGroup, setNewGroup] = useState<NewGroupForm>({
    key: "",
    title: "",
    description: "",
    inputType: "checkbox",
    mandatory: false,
  });

  const rows = useMemo(() => buildRows(groups), [groups]);
  const groupRows = useMemo(() => buildGroupRows(groups), [groups]);

  useEffect(() => {
    let isCancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/guarantees?assuranceType=${assuranceType}`);
        const data = (await response.json()) as { groups?: GuaranteeGroup[]; error?: string };

        if (!response.ok) {
          throw new Error(data.error || "Failed to load guarantees");
        }

        if (!isCancelled) {
          setGroups(data.groups ?? []);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unexpected error");
          setGroups([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isCancelled = true;
    };
  }, [assuranceType]);

  const isAdmin = status === "authenticated" && session?.user?.role === "ADMIN";

  const startEdit = (row: GuaranteeRow) => {
    setEditingRow({
      optionId: row.optionId,
      key: row.optionKey,
      label: row.optionLabel,
      price: String(row.optionPrice),
    });
  };

  const submitEdit = async () => {
    if (!editingRow) {
      return;
    }

    const parsedPrice = Number(editingRow.price);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Le prix doit etre un nombre positif ou nul.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/guarantees/options/${editingRow.optionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: editingRow.key,
          label: editingRow.label,
          price: parsedPrice,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Update failed");
      }

      setGroups((prev) => updateOptionInGroups(prev, editingRow, parsedPrice));
      setEditingRow(null);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingRow) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/guarantees/options/${deletingRow.optionId}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Delete failed");
      }

      setGroups((prev) => removeOptionFromGroups(prev, deletingRow.optionId));
      setDeletingRow(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  const startEditGroup = (row: GroupRow) => {
    const source = groups.find((group) => group.id === row.groupId);
    setEditingGroup({
      groupId: row.groupId,
      key: row.groupKey,
      title: row.groupTitle,
      description: source?.description ?? "",
      inputType: row.inputType,
      mandatory: row.mandatory,
    });
  };

  const submitEditGroup = async () => {
    if (!editingGroup) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/guarantees/groups/${editingGroup.groupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingGroup),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Update failed");
      }

      setGroups((prev) => updateGroupInGroups(prev, editingGroup));
      setEditingGroup(null);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteGroup = async () => {
    if (!deletingGroup) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/guarantees/groups/${deletingGroup.groupId}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Delete failed");
      }

      setGroups((prev) => removeGroupFromGroups(prev, deletingGroup.groupId));
      setDeletingGroup(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  const submitNewOption = async () => {
    const parsedPrice = Number(newOption.price);

    if (!newOption.groupId || !newOption.key.trim() || !newOption.label.trim()) {
      setError("Group, key et label sont requis.");
      return;
    }

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Le prix doit etre un nombre positif ou nul.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/guarantees/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: newOption.groupId,
          key: newOption.key,
          label: newOption.label,
          price: parsedPrice,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        option?: GuaranteeOption;
      };

      if (!response.ok || !data.option) {
        throw new Error(data.error || "Create option failed");
      }

      setGroups((prev) => addOptionToGroups(prev, newOption.groupId, data.option as GuaranteeOption));
      setNewOption({ groupId: "", key: "", label: "", price: "0" });
      setIsAddOptionOpen(false);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  const submitNewGroup = async () => {
    if (!newGroup.key.trim() || !newGroup.title.trim()) {
      setError("Cle et titre sont requis.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/guarantees/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assuranceType,
          key: newGroup.key,
          title: newGroup.title,
          description: newGroup.description,
          inputType: newGroup.inputType,
          mandatory: newGroup.mandatory,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        group?: GuaranteeGroup;
      };

      if (!response.ok || !data.group) {
        throw new Error(data.error || "Create group failed");
      }

      setGroups((prev) => addGroupToGroups(prev, data.group as GuaranteeGroup));
      setNewGroup({ key: "", title: "", description: "", inputType: "checkbox", mandatory: false });
      setIsAddGroupOpen(false);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return <p className="text-sm text-gray-500">Chargement...</p>;
  }

  if (!isAdmin) {
    return <p className="text-sm text-red-600">Acces refuse: admin uniquement.</p>;
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-700">Gestion des garanties</h1>
        <p className="mt-1 text-sm text-gray-500">Gerez les garanties et groupes de garanties.</p>
      </div>

      <Card className="border border-gray-200 bg-white">
        <div className="flex gap-2 p-3">
          <Button type="button" variant={assuranceType === "car" ? "primary" : "outline"} onPress={() => setAssuranceType("car")}>
            Automobile
          </Button>
          <Button type="button" variant={assuranceType === "farmer" ? "primary" : "outline"} onPress={() => setAssuranceType("farmer")}>
            Agricole
          </Button>
        </div>
      </Card>

      {error ? (
        <Card className="border border-red-200 bg-red-50">
          <div className="px-3 py-2 text-sm text-red-700">{error}</div>
        </Card>
      ) : null}

      <Card className="border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-3 py-3">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant={activeTab === "options" ? "primary" : "outline"} onPress={() => setActiveTab("options")}>
              Options de garanties
            </Button>
            <Button type="button" variant={activeTab === "groups" ? "primary" : "outline"} onPress={() => setActiveTab("groups")}>
              Groupes de garanties
            </Button>
          </div>
        </div>

        {activeTab === "options" ? (
          <>
            <div className="px-4 pt-3">
              <Button type="button" variant="primary" onPress={() => setIsAddOptionOpen(true)}>
                Ajouter une option
              </Button>
            </div>
            {isLoading ? <p className="px-4 py-3 text-sm text-gray-500">Chargement des garanties...</p> : null}
            {!isLoading && rows.length === 0 ? <p className="px-4 py-3 text-sm text-gray-500">Aucune garantie trouvee.</p> : null}
            {!isLoading && rows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Groupe</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Type</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Obligatoire</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Key</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Garantie</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Prix</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.optionId} className="border-t border-gray-100">
                        <td className="px-4 py-3 text-gray-700">{row.groupTitle}</td>
                        <td className="px-4 py-3 text-gray-700">{row.groupInputType}</td>
                        <td className="px-4 py-3 text-gray-700">{row.mandatory ? "Oui" : "Non"}</td>
                        <td className="px-4 py-3 text-gray-700">{row.optionKey}</td>
                        <td className="px-4 py-3 text-gray-700">{row.optionLabel}</td>
                        <td className="px-4 py-3 text-gray-700">{row.optionPrice} DA</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onPress={() => startEdit(row)}>Modifier</Button>
                            <Button type="button" variant="secondary" onPress={() => setDeletingRow(row)}>Supprimer</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </>
        ) : null}

        {activeTab === "groups" ? (
          <>
            <div className="px-4 pt-3">
              <Button type="button" variant="primary" onPress={() => setIsAddGroupOpen(true)}>
                Ajouter un groupe
              </Button>
            </div>
            {isLoading ? <p className="px-4 py-3 text-sm text-gray-500">Chargement des groupes...</p> : null}
            {!isLoading && groupRows.length === 0 ? <p className="px-4 py-3 text-sm text-gray-500">Aucun groupe trouve.</p> : null}
            {!isLoading && groupRows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Cle</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Titre</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Type</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Obligatoire</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Options</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupRows.map((row) => (
                      <tr key={row.groupId} className="border-t border-gray-100">
                        <td className="px-4 py-3 text-gray-700">{row.groupKey}</td>
                        <td className="px-4 py-3 text-gray-700">{row.groupTitle}</td>
                        <td className="px-4 py-3 text-gray-700">{row.inputType}</td>
                        <td className="px-4 py-3 text-gray-700">{row.mandatory ? "Oui" : "Non"}</td>
                        <td className="px-4 py-3 text-gray-700">{row.optionCount}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onPress={() => startEditGroup(row)}>Modifier</Button>
                            <Button type="button" variant="secondary" onPress={() => setDeletingGroup(row)}>Supprimer</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </>
        ) : null}
      </Card>

      <Modal isOpen={editingRow !== null} onOpenChange={(open) => !open && setEditingRow(null)}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-130">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Modifier la garantie</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <div className="space-y-3">
                  <label htmlFor="edit-key" className="mb-1 block text-xs font-semibold text-gray-500">Key</label>
                  <Input id="edit-key" value={editingRow?.key ?? ""} onChange={(event) => setEditingRow((prev) => (prev ? { ...prev, key: event.target.value } : prev))} />
                  <label htmlFor="edit-label" className="mb-1 block text-xs font-semibold text-gray-500">Label</label>
                  <Input id="edit-label" value={editingRow?.label ?? ""} onChange={(event) => setEditingRow((prev) => (prev ? { ...prev, label: event.target.value } : prev))} />
                  <label htmlFor="edit-price" className="mb-1 block text-xs font-semibold text-gray-500">Prix (DA)</label>
                  <Input id="edit-price" type="number" min={0} value={editingRow?.price ?? ""} onChange={(event) => setEditingRow((prev) => (prev ? { ...prev, price: event.target.value } : prev))} />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline" onPress={() => setEditingRow(null)}>Annuler</Button>
                <Button variant="primary" onPress={submitEdit} isDisabled={submitting}>{submitting ? "En cours..." : "Enregistrer"}</Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <Modal isOpen={isAddOptionOpen} onOpenChange={(open) => !open && setIsAddOptionOpen(false)}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-130">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Ajouter une option</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <div className="space-y-3">
                  <label htmlFor="new-option-group" className="mb-1 block text-xs font-semibold text-gray-500">Groupe</label>
                  <select
                    id="new-option-group"
                    value={newOption.groupId}
                    onChange={(event) => setNewOption((prev) => ({ ...prev, groupId: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Selectionnez un groupe</option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.title}
                      </option>
                    ))}
                  </select>

                  <label htmlFor="new-option-key" className="mb-1 block text-xs font-semibold text-gray-500">Key</label>
                  <Input
                    id="new-option-key"
                    value={newOption.key}
                    onChange={(event) => setNewOption((prev) => ({ ...prev, key: event.target.value }))}
                  />

                  <label htmlFor="new-option-label" className="mb-1 block text-xs font-semibold text-gray-500">Label</label>
                  <Input
                    id="new-option-label"
                    value={newOption.label}
                    onChange={(event) => setNewOption((prev) => ({ ...prev, label: event.target.value }))}
                  />

                  <label htmlFor="new-option-price" className="mb-1 block text-xs font-semibold text-gray-500">Prix (DA)</label>
                  <Input
                    id="new-option-price"
                    type="number"
                    min={0}
                    value={newOption.price}
                    onChange={(event) => setNewOption((prev) => ({ ...prev, price: event.target.value }))}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline" onPress={() => setIsAddOptionOpen(false)}>Annuler</Button>
                <Button variant="primary" onPress={submitNewOption} isDisabled={submitting}>
                  {submitting ? "En cours..." : "Ajouter"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <Modal isOpen={deletingRow !== null} onOpenChange={(open) => !open && setDeletingRow(null)}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-130">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Supprimer la garantie</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p className="text-sm text-gray-700">
                  Voulez-vous vraiment supprimer <span className="font-semibold">{deletingRow?.optionLabel}</span> ?
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline" onPress={() => setDeletingRow(null)}>Annuler</Button>
                <Button variant="secondary" onPress={confirmDelete} isDisabled={submitting}>{submitting ? "En cours..." : "Supprimer"}</Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <Modal isOpen={editingGroup !== null} onOpenChange={(open) => !open && setEditingGroup(null)}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-130">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Modifier le groupe</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <div className="space-y-3">
                  <label htmlFor="group-key" className="mb-1 block text-xs font-semibold text-gray-500">Cle</label>
                  <Input id="group-key" value={editingGroup?.key ?? ""} onChange={(event) => setEditingGroup((prev) => (prev ? { ...prev, key: event.target.value } : prev))} />
                  <label htmlFor="group-title" className="mb-1 block text-xs font-semibold text-gray-500">Titre</label>
                  <Input id="group-title" value={editingGroup?.title ?? ""} onChange={(event) => setEditingGroup((prev) => (prev ? { ...prev, title: event.target.value } : prev))} />
                  <label htmlFor="group-description" className="mb-1 block text-xs font-semibold text-gray-500">Description</label>
                  <Input id="group-description" value={editingGroup?.description ?? ""} onChange={(event) => setEditingGroup((prev) => (prev ? { ...prev, description: event.target.value } : prev))} />
                  <label htmlFor="group-type" className="mb-1 block text-xs font-semibold text-gray-500">Type</label>
                  <select
                    id="group-type"
                    value={editingGroup?.inputType ?? "checkbox"}
                    onChange={(event) => setEditingGroup((prev) => (prev ? { ...prev, inputType: event.target.value as InputType } : prev))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="checkbox">Checkbox</option>
                    <option value="selectgroup">SelectGroup</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <input
                      id="group-mandatory"
                      type="checkbox"
                      checked={editingGroup?.mandatory ?? false}
                      onChange={(event) => setEditingGroup((prev) => (prev ? { ...prev, mandatory: event.target.checked } : prev))}
                      className="h-4 w-4"
                    />
                    <label htmlFor="group-mandatory" className="text-xs font-semibold text-gray-500">Obligatoire</label>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline" onPress={() => setEditingGroup(null)}>Annuler</Button>
                <Button variant="primary" onPress={submitEditGroup} isDisabled={submitting}>{submitting ? "En cours..." : "Enregistrer"}</Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <Modal isOpen={deletingGroup !== null} onOpenChange={(open) => !open && setDeletingGroup(null)}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-130">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Supprimer le groupe</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p className="text-sm text-gray-700">
                  Voulez-vous vraiment supprimer le groupe <span className="font-semibold">{deletingGroup?.groupTitle}</span> ?
                  {deletingGroup?.optionCount ? (
                    <span className="ml-1 text-gray-600">
                      (Ce groupe contient {deletingGroup.optionCount} option{deletingGroup.optionCount > 1 ? "s" : ""})
                    </span>
                  ) : null}
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline" onPress={() => setDeletingGroup(null)}>Annuler</Button>
                <Button variant="secondary" onPress={confirmDeleteGroup} isDisabled={submitting}>{submitting ? "En cours..." : "Supprimer"}</Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <Modal isOpen={isAddGroupOpen} onOpenChange={(open) => !open && setIsAddGroupOpen(false)}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-130">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Ajouter un groupe</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <div className="space-y-3">
                  <label htmlFor="new-group-key" className="mb-1 block text-xs font-semibold text-gray-500">Cle</label>
                  <Input
                    id="new-group-key"
                    value={newGroup.key}
                    onChange={(event) => setNewGroup((prev) => ({ ...prev, key: event.target.value }))}
                  />

                  <label htmlFor="new-group-title" className="mb-1 block text-xs font-semibold text-gray-500">Titre</label>
                  <Input
                    id="new-group-title"
                    value={newGroup.title}
                    onChange={(event) => setNewGroup((prev) => ({ ...prev, title: event.target.value }))}
                  />

                  <label htmlFor="new-group-description" className="mb-1 block text-xs font-semibold text-gray-500">Description</label>
                  <Input
                    id="new-group-description"
                    value={newGroup.description}
                    onChange={(event) => setNewGroup((prev) => ({ ...prev, description: event.target.value }))}
                  />

                  <label htmlFor="new-group-type" className="mb-1 block text-xs font-semibold text-gray-500">Type</label>
                  <select
                    id="new-group-type"
                    value={newGroup.inputType}
                    onChange={(event) => setNewGroup((prev) => ({ ...prev, inputType: event.target.value as InputType }))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="checkbox">Checkbox</option>
                    <option value="selectgroup">SelectGroup</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <input
                      id="new-group-mandatory"
                      type="checkbox"
                      checked={newGroup.mandatory}
                      onChange={(event) => setNewGroup((prev) => ({ ...prev, mandatory: event.target.checked }))}
                      className="h-4 w-4"
                    />
                    <label htmlFor="new-group-mandatory" className="text-xs font-semibold text-gray-500">Obligatoire</label>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline" onPress={() => setIsAddGroupOpen(false)}>Annuler</Button>
                <Button variant="primary" onPress={submitNewGroup} isDisabled={submitting}>
                  {submitting ? "En cours..." : "Ajouter"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </section>
  );
}
