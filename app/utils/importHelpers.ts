import * as XLSX from 'xlsx';

export async function parseProveedorArticuloExcel(file: File) {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet, { defval: '' }) as {
    nombreProveedor: string;
    nombreArt: string;
    costoUnitarioAP: number; // ✅ debe coincidir con la columna del Excel
    cargoPedidoAP: number;
    demoraEntregaAP: number;
  }[];

}
