'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { CheckIcon, PencilIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { QuestionProps } from '@/app/types/types';

export const Question: React.FC<QuestionProps> = ({
  id,
  text,
  type,
  options,
  required = false,
  value,
  onChange,
}) => {
  // ✅ تهيئة النص المبدئي من القيمة القادمة من الأعلى
  const initialText = Array.isArray(value) && value.length > 0 ? value[0] : '';
  const [localValue, setLocalValue] = useState(initialText);
  const [isFocused, setIsFocused] = useState(false);
  const [hasContent, setHasContent] = useState(!!initialText);

  // ✅ تحديث localValue فقط عند تغير props.value من الخارج
  useEffect(() => {
    const newText = Array.isArray(value) && value.length > 0 ? value[0] : '';
    if (newText !== localValue) {
      setLocalValue(newText);
      setHasContent(!!newText);
    }
    // لا نضيف localValue هنا وإلا سيُعاد التعيين أثناء الكتابة
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // ✅ دالة الحفظ المؤجل (debounced)
  const debouncedSave = useCallback(
    debounce((newValue: string[]) => {
      onChange(newValue);
      console.log(`Debounced save for question ${id}:`, newValue);
    }, 500),
    [onChange, id]
  );

  // ✅ تحديث النص محلياً وإرسال بعد التأخير
  const handleTextChange = (newValue: string) => {
    const arrayValue = newValue ? [newValue] : [];
    setLocalValue(newValue);
    setHasContent(!!newValue);
    debouncedSave(arrayValue);
  };

  const handleOptionChange = (newValue: string | string[]) => {
    const arrayValue = typeof newValue === 'string' ? [newValue] : newValue;
    onChange(arrayValue);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  if (!id || id === 'undefined') {
    console.error('Invalid question ID:', id);
    return null;
  }

  return (
    <div className="group relative mb-6 md:mb-8 transition-all duration-300 hover:scale-[1.01]">
      <div
        className={`relative p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm
        ${
          isFocused
            ? 'bg-white/10 border-blue-600/40 shadow-lg shadow-blue-600/10 scale-[1.01]'
            : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
        }`}
      >
        {/* عنوان السؤال */}
        <div className="flex items-start gap-3 mb-6">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
            ${
              hasContent
                ? 'bg-linear-to-br from-emerald-500 to-teal-500 text-gray-500'
                : 'bg-linear-to-br from-blue-600 to-cyan-500 text-gray-500'
            }`}
          >
            {hasContent ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1">
            <label
              className="block text-gray-500 text-lg md:text-xl font-semibold leading-relaxed"
              htmlFor={`${id}-text`}
            >
              {text}
              {required && (
                <span className="text-rose-300 ml-2 text-sm font-normal">(Requis)</span>
              )}
            </label>
          </div>
        </div>

        {/* حقل النص */}
        {type !== 'checkbox' && (
          <div className="relative mb-4">
            <div
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-200
              ${isFocused || hasContent ? 'text-blue-500' : 'text-gray-500/25'}`}
            >
              <PencilIcon className="w-5 h-5" />
            </div>

            <input
              type="text"
              id={`${id}-text`}
              name={`${id}-text`}
              value={localValue}
              onChange={(e) => handleTextChange(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required={required}
              className={`w-full pl-12 pr-4 py-4 text-base md:text-lg rounded-xl border transition-all duration-200
                bg-[#0f1020] text-gray-500 placeholder:text-gray-500/25
                focus:outline-none focus:ring-4 focus:ring-blue-600/15
                ${
                  isFocused
                    ? 'border-blue-600/40 bg-[#14162a]'
                    : 'border-white/10 hover:border-white/20'
                }
                ${hasContent ? 'border-emerald-500/30' : ''}`}
              placeholder="Tapez votre réponse ici..."
            />

            {hasContent && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        )}

        {/* خيارات متعددة (checkbox) */}
        {type === 'checkbox' && options && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-500/55 mb-4">
              Sélectionnez une ou plusieurs options :
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((option, index) => {
                const isSelected = Array.isArray(value) && value.includes(option);
                return (
                  <div key={`${id}-${index}`} className="relative">
                    <input
                      type="checkbox"
                      id={`${id}-${index}`}
                      name={`${id}[]`}
                      value={option}
                      checked={isSelected}
                      onChange={(e) => {
                        const newValue = e.target.checked
                          ? [...(Array.isArray(value) ? value : []), option]
                          : (Array.isArray(value) ? value : []).filter((v) => v !== option);
                        handleOptionChange(newValue);
                      }}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`${id}-${index}`}
                      className={`group/option relative flex items-center p-4 rounded-xl border-2 cursor-pointer
                        transition-all duration-200 hover:scale-[1.02]
                        ${
                          isSelected
                            ? 'bg-linear-to-r from-blue-600 to-cyan-500 text-gray-500 border-blue-500 shadow-lg shadow-blue-600/20'
                            : 'bg-white/5 border-white/10 text-gray-500/70 hover:border-white/20 hover:bg-white/10'
                        }`}
                    >
                      <div
                        className={`flex-shrink-0 w-5 h-5 mr-3 rounded border-2 flex items-center justify-center
                          transition-all duration-200
                          ${
                            isSelected
                              ? 'border-white bg-white'
                              : 'border-white/20 group-hover/option:border-blue-500'
                          }`}
                      >
                        {isSelected && <CheckIcon className="w-3 h-3 text-blue-600" />}
                      </div>

                      <span
                        className={`font-medium text-sm md:text-base transition-all duration-200
                        ${isSelected ? 'text-gray-500' : 'text-gray-500/70'}`}
                      >
                        {option}
                      </span>

                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 rounded-b-2xl overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out
            ${
              hasContent
                ? 'w-full bg-linear-to-r from-emerald-500 to-teal-500'
                : 'w-0 bg-linear-to-r from-blue-600 to-cyan-500'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
