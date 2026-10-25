import { useState } from 'react';
import { dataService } from './data/DataService';
export interface JourneySettings { deposit_amount: number; final_fee_amount: number; }
export const DEFAULT_SETTINGS: JourneySettings = { deposit_amount: 500, final_fee_amount: 2000 };
function readJourneySettings(): JourneySettings {
  try {
    const p = JSON.parse(dataService.db.settings.get('payment_settings') || '{}');
    const initial = Number.isFinite(p.journeyDepositAmount) && p.journeyDepositAmount >= 0 ? p.journeyDepositAmount : 500;
    const total = Number.isFinite(p.journeyTotalFee) && p.journeyTotalFee >= initial ? p.journeyTotalFee : 2500;
    return { deposit_amount: initial, final_fee_amount: Math.max(0, total - initial) };
  } catch { return DEFAULT_SETTINGS; }
}
export function useSettings() { const [settings] = useState(readJourneySettings); return { settings, loaded: true }; }
export async function fetchSettings() { return readJourneySettings(); }
