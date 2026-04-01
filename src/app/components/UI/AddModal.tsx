"use client";
import React, { FormEvent, useState } from "react";
import { Modal, Button, Input, Select, Checkbox, Label, ListBox } from "@heroui/react";
import { FaPlus } from "react-icons/fa";

interface FormData {
  questionText: string;
  category: string;
  type: "text" | "radio" | "checkbox" | "select";
  optionsList: string[];
  required: boolean;
}

export default function AddQuestionModal() {
  const [isOpen, setIsOpen] = useState(false);
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
        setIsOpen(false); // Close the modal
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
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        onPress={() => setIsOpen(true)}
        className="bg-blue-600 text-gray-200 h-[35px] min-w-[35px] p-2 flex justify-center items-center"
      >
        <p>Add New Question</p>
        <FaPlus />
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[500px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Add New Question</Modal.Heading>
            </Modal.Header>
            <form onSubmit={handleAddQuestion}>
              <Modal.Body>
                {/* Question Text */}
                <Input
                  name="questionText"
                  type="text"
                  value={formData.questionText}
                  onChange={(e) => handleChange("questionText", e.target.value)}
                  className="max-w-xs"
                />

                {/* Category */}
                <Select
                  className="w-full"
                  placeholder="Select Category"
                  value={formData.category}
                  onChange={(key: any) => setFormData({ ...formData, category: key })}
                >
                  <Label>Category</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {categories.map((cat) => (
                        <ListBox.Item key={cat} id={cat} textValue={cat}>
                          {cat}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                {/* Question Type */}
                <Select
                  className="w-full"
                  placeholder="Select Type"
                  value={formData.type}
                  onChange={(key: any) =>
                    setFormData({
                      ...formData,
                      type: key as "text" | "checkbox",
                      optionsList: key === "text" ? [] : formData.optionsList,
                    })
                  }
                >
                  <Label>Question Type</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {questionTypes.map((type) => (
                        <ListBox.Item key={type} id={type} textValue={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                {/* Options List (Conditional) */}
                {formData.type === "checkbox" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 font-semibold">Options</label>
                    {formData.optionsList.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 text-sm"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onPress={() => removeOption(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="secondary"
                      onPress={addOption}
                      className="mt-2"
                    >
                      Add Option
                    </Button>
                  </div>
                )}

                {/* Required */}
                <Checkbox 
                  id="required-terms"
                  isSelected={formData.required}
                  onChange={(isSelected) => setFormData({ ...formData, required: isSelected })}
                >
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Content>
                    <Label htmlFor="required-terms">Required</Label>
                  </Checkbox.Content>
                </Checkbox>

                {/* General Error */}
                {errors.general && <p className="text-red-400 text-sm">{errors.general}</p>}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="outline"
                  onPress={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Add Question
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}