'use client'
import React, { useState } from 'react'

const faqs = [
  {
    q: 'Mes données sont-elles sécurisées ?',
    a: 'Oui, toutes vos données sont protégées et confidentielles. Nous utilisons le chiffrement en transit et au repos.',
  },
  {
    q: 'Puis-je modifier mes informations après enregistrement ?',
    a: 'Oui. Vous pouvez mettre à jour vos informations personnelles et ajuster votre demande depuis votre espace client.',
  },
  {
    q: 'Puis-je personnaliser ma couverture ?',
    a: 'Oui, vous pouvez sélectionner les garanties qui correspondent à votre situation et à votre budget.',
  },
  {
    q: "Comment suivre l'état de mon dossier ?",
    a: 'Vous pouvez suivre toutes les étapes depuis votre espace client : soumission, vérification, validation et mises à jour.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-8 px-4" style={{ background: '#d4d0c8' }}>
      <div className="max-w-3xl mx-auto">
        <div className="win-window">
          <div className="win-titlebar">
            <span>❓</span>
            <span>FAQ — Questions fréquentes</span>
            <div className="ml-auto flex items-center gap-1">
              <button className="win-btn" style={{ padding: '0 6px', minWidth: 18, height: 16, fontSize: 10 }} aria-label="Minimize">_</button>
              <button className="win-btn" style={{ padding: '0 6px', minWidth: 18, height: 16, fontSize: 10 }} aria-label="Maximize">□</button>
            </div>
          </div>

          <div className="p-4">
            <p className="text-xs mb-4" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#444' }}>
              Tout ce que vous devez savoir avant de commencer.
            </p>

            {/* Tree-view style accordion */}
            <div className="win-inset p-2">
              {faqs.map((item, index) => (
                <div key={item.q}>
                  {/* Question row */}
                  <button
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-left"
                    style={{
                      background: openIndex === index ? '#0a246a' : 'transparent',
                      color: openIndex === index ? '#fff' : '#000',
                      fontFamily: 'Tahoma, Arial, sans-serif',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    <span style={{ fontFamily: 'monospace', fontSize: 10, minWidth: 12 }}>
                      {openIndex === index ? '▼' : '►'}
                    </span>
                    <span style={{ fontSize: 11 }}>{item.q}</span>
                  </button>

                  {/* Answer panel */}
                  {openIndex === index && (
                    <div className="ml-6 mb-1">
                      <div className="win-inset p-2">
                        <p className="text-xs" style={{ fontFamily: 'Tahoma, Arial, sans-serif', color: '#222', lineHeight: 1.6 }}>
                          {item.a}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-3 pt-2" style={{ borderTop: '1px solid #808080' }}>
              <button className="win-btn win-btn-primary text-xs" style={{ padding: '4px 20px' }}>OK</button>
              <button className="win-btn text-xs" style={{ padding: '4px 20px' }}>Aide</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
