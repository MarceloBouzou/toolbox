'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import Link from 'next/link';

export default function ConsolidarExcelPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
      setStatus('');
    }
  };

  const handleConsolidate = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setStatus('Iniciando motor de procesamiento...');

    try {
      const allData: any[] = [];

      for (const file of files) {
        setStatus(`Leyendo: ${file.name}...`);
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          // Modificación: Las columnas de fuente van al final
          const rowsWithSource = jsonData.map((row: any) => ({
            ...row,
            Fuente_Archivo: file.name,
            Fuente_Hoja: sheetName
          }));
          allData.push(...rowsWithSource);
        });
      }

      setStatus('Unificando datos y generando Excel...');

      if (allData.length === 0) {
        alert('Los archivos parecen estar vacíos.');
        setIsProcessing(false);
        return;
      }

      const newWorksheet = XLSX.utils.json_to_sheet(allData);
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Consolidado");
      XLSX.writeFile(newWorkbook, "Consolidado_Master.xlsx");

      setStatus('¡Éxito! Tu archivo se ha descargado.');

    } catch (error) {
      console.error(error);
      setStatus('Error crítico: Revisa el formato de tus archivos.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb / Volver */}
        <div className="mb-6">
          <Link href="/" className="text-slate-500 hover:text-blue-600 flex items-center text-sm font-medium transition-colors">
            &larr; Volver al inicio
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">

          {/* Header de la Herramienta */}
          <div className="bg-blue-600 px-8 py-10 text-center text-white">
            <h1 className="text-3xl font-bold">Consolidador de Excel</h1>
            <p className="mt-2 text-blue-100 text-lg">
              Unifica múltiples reportes en una sola tabla maestra.
            </p>
          </div>

          <div className="p-8">
            {/* Dropzone */}
            <div className="mb-8">
              <label htmlFor="dropzone-file" className="group flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                  <svg className="w-12 h-12 mb-4 text-slate-400 group-hover:text-blue-500 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                  </svg>
                  <p className="mb-2 text-lg text-slate-700 font-medium">Haz clic o arrastra tus archivos aquí</p>
                  <p className="text-sm text-slate-500">Soporta archivos .xlsx y .xls</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" multiple accept=".xlsx, .xls" onChange={handleFileChange} />
              </label>
            </div>

            {/* Lista de Archivos Seleccionados */}
            {files.length > 0 && (
              <div className="mb-8 bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">
                  Archivos seleccionados ({files.length})
                </h3>
                <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center text-sm text-slate-600 bg-white p-2 rounded border border-slate-100 shadow-sm">
                      <span className="mr-2 text-green-500">✓</span> {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Área de Acción */}
            <div className="flex flex-col items-center">
              {status && (
                <div className={`mb-4 px-4 py-2 rounded-full text-sm font-medium ${status.includes('Error') ? 'bg-red-100 text-red-700' :
                    status.includes('Éxito') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                  {status}
                </div>
              )}

              <button
                onClick={handleConsolidate}
                disabled={files.length === 0 || isProcessing}
                className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200
                           hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5
                           disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed disabled:translate-y-0
                           transition-all duration-200 text-lg"
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  'Consolidar Archivos'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}