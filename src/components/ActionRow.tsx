import { useState } from 'react';
import { MessageSquareText } from 'lucide-react';
import type { ActionItem, ActionStatus, Owner } from '../types';
import { useWorkspace } from '../state/workspace';
import { ACTION_STATUSES, OWNERS } from '../lib/taxonomy';
import { cx } from './ui';

const STATUS_KEYS = Object.keys(ACTION_STATUSES) as ActionStatus[];

const selectCls =
  'rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

/** Editable action item: status, owner, due date and notes, persisted to the workspace. */
export function ActionRow({ action, context }: { action: ActionItem; context?: React.ReactNode }) {
  const { progress, updateAction } = useWorkspace();
  const p = progress[action.id];
  const status = p?.status ?? 'not_started';
  const [notesOpen, setNotesOpen] = useState(Boolean(p?.notes));

  return (
    <li className={cx('rounded-xl border border-slate-200 p-3', status === 'done' && 'bg-emerald-50/40', status === 'not_applicable' && 'opacity-60')}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={status === 'done'}
          onChange={(e) => updateAction(action.id, { status: e.target.checked ? 'done' : 'not_started' })}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-emerald-600"
          aria-label={`Mark "${action.text}" as done`}
        />
        <div className="min-w-0 flex-1">
          {context}
          <p className={cx('text-sm leading-snug text-slate-800', status === 'done' && 'text-slate-500 line-through decoration-slate-300')}>
            {action.text}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor={`${action.id}-status`}>Status</label>
            <select
              id={`${action.id}-status`}
              value={status}
              onChange={(e) => updateAction(action.id, { status: e.target.value as ActionStatus })}
              className={selectCls}
            >
              {STATUS_KEYS.map((s) => (
                <option key={s} value={s}>{ACTION_STATUSES[s].label}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor={`${action.id}-owner`}>Owner</label>
            <select
              id={`${action.id}-owner`}
              value={p?.owner ?? action.owner}
              onChange={(e) => updateAction(action.id, { owner: e.target.value as Owner })}
              className={selectCls}
            >
              {OWNERS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor={`${action.id}-due`}>Due date</label>
            <input
              id={`${action.id}-due`}
              type="date"
              value={p?.due ?? ''}
              onChange={(e) => updateAction(action.id, { due: e.target.value || undefined })}
              className={selectCls}
            />
            <button
              type="button"
              onClick={() => setNotesOpen((o) => !o)}
              className={cx('inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium', p?.notes ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700')}
              aria-expanded={notesOpen}
            >
              <MessageSquareText className="h-3.5 w-3.5" />
              {p?.notes ? 'Notes' : 'Add note'}
            </button>
          </div>
          {notesOpen && (
            <textarea
              defaultValue={p?.notes ?? ''}
              onBlur={(e) => {
                if (e.target.value !== (p?.notes ?? '')) updateAction(action.id, { notes: e.target.value || undefined });
              }}
              rows={2}
              placeholder="Gap analysis, evidence, decisions…"
              className="mt-2 w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="Notes"
            />
          )}
        </div>
      </div>
    </li>
  );
}
