"use client";
import React, { FormEvent, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem, Checkbox } from "@heroui/react";
import { FaPlus } from "react-icons/fa";

interface FormData {
  questionText: string;
  category: string;
  type: "text" | "radio" | "checkbox" | "select";
  optionsList: string[];
  required: boolean;
}

export default function AddQuestionModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [formData, setFormData] = useState<FormData>({
    questionText: "",
    category: "Segments Clients",
    type: "text",
    optionsList: [],
    required: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const categories = [
    "Segments Clients",
    "Proposition de valeur",
    "Canaux",
    "Relation Clients",
    "Sources de Revenus",
    "Ressources Clés",
    "Activités Clés",
    "Partenaires Clés",
    "Structure de Coûts",
  ];

  const questionTypes = ["text", "checkbox"];

  const addOption = () => {
    setFormData({
      ...formData,
      optionsList: [...formData.optionsList, ""],
    });
  };

  const removeOption = (index: number) => {
    setFormData({
      ...formData,
      optionsList: formData.optionsList.filter((_, i) => i !== index),
    });
  };

  const updateOption = (index: number, content: string) => {
    const updatedOptions = [...formData.optionsList];
    updatedOptions[index] = content;
    setFormData({ ...formData, optionsList: updatedOptions });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.questionText.trim()) {
      newErrors.questionText = "Question text is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleChange = (
    field: keyof FormData,
    value: string | boolean | "text" | "radio" | "checkbox" | "select"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "type" && value === "text" ? { optionsList: [] } : {}),
    }));
    setErrors({});
  };

  const handleAddQuestion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    const newQuestion = {
      questionText: formData.questionText,
      category: formData.category,
      type: formData.type,
      optionsList: formData.optionsList.filter((o) => o.trim()),
      required: formData.required,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`../../api/bmc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuestion),
      });

      if (response.ok) {
        console.log("Successfully Added Question");
        setFormData({
          questionText: "",
          category: "Segments Clients",
          type: "text",
          optionsList: [],
          required: false,
        });
        setErrors({});
        onOpenChange(); // Close the modal
      } else {
        const data = await response.json();
        setErrors({ general: data.message || "Failed to add question" });
      }
    } catch (error) {
      console.error("Error Adding Question:", error);
      setErrors({ general: "An error occurred. Please try again." });
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        className="bg-blue-600 text-gray-200 h-[35px] min-w-[35px] p-2 flex justify-center items-center"
      >
        <p>Add New Question</p>
        <FaPlus />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add New Question</ModalHeader>
              <form onSubmit={handleAddQuestion}>
                <ModalBody>
                  {/* Question Text */}
                  <Input
                    size="sm"
                    name="questionText"
                    type="text"
                    label="Question Text"
                    value={formData.questionText}
                    onChange={(e) => handleChange("questionText", e.target.value)}
                    className="max-w-xs"
                    isInvalid={!!errors.questionText}
                    errorMessage={errors.questionText}
                  />

                  {/* Category */}
                  <Select
                    size="sm"
                    label="Category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="max-w-xs"
                  >
                    {categories.map((cat) => (
                      <SelectItem key={cat} data-value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </Select>

                  {/* Question Type */}
                  <Select
                    size="sm"
                    label="Question Type"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as "text" | "checkbox",
                        optionsList: e.target.value === "text" ? [] : formData.optionsList,
                      })
                    }
                    className="max-w-xs"
                  >
                    {questionTypes.map((type) => (
                      <SelectItem key={type} data-value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </Select>

                  {/* Options List (Conditional) */}
                  {formData.type === "checkbox" && (
                    <div className="flex flex-col gap-2">
                      <label className="text-gray-700 font-semibold">Options</label>
                      {formData.optionsList.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            size="sm"
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            color="danger"
                            variant="light"
                            onPress={() => removeOption(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        color="primary"
                        variant="light"
                        onPress={addOption}
                        className="mt-2"
                      >
                        Add Option
                      </Button>
                    </div>
                  )}

                  {/* Required */}
                  <div className="flex items-center">
                    <Checkbox
                      isSelected={formData.required}
                      onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                    >
                      Required
                    </Checkbox>
                  </div>

                  {/* General Error */}
                  {errors.general && <p className="text-red-400 text-sm">{errors.general}</p>}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit">
                    Add Question
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}