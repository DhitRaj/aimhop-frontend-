"use client";

import { useState, useEffect } from "react";
import { Save, Eye, EyeOff, GripVertical, RefreshCw, Edit, X, Check, Loader2 } from "lucide-react";
import { pageLayoutAPI } from "@/lib/api";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Section {
  component: string;
  title?: string;
  subtitle?: string;
  isVisible: boolean;
  order: number;
}

const SECTION_LABELS: Record<string, string> = {
  HeroSection: "🎯 Hero Banner",
  TrustedBySection: "🤝 Trusted By Brands",
  CctvSurveillanceSection: "📹 CCTV & Surveillance",
  WhyAimhopSection: "⭐ Why AimHop",
  ServicesPreviewSection: "🛡️ Services Preview",
  TestimonialsPreviewSection: "💬 Client Testimonials",
  BlogsPreviewSection: "📰 Latest Blogs",
  CtaSection: "📞 Call to Action",
};

const DEFAULT_SECTIONS: Section[] = [
  { component: "HeroSection", title: "Protecting The Future Of India.", isVisible: true, order: 1 },
  { component: "TrustedBySection", isVisible: true, order: 2 },
  { component: "CctvSurveillanceSection", title: "CCTV & Surveillance Hub.", isVisible: true, order: 3 },
  { component: "WhyAimhopSection", title: "Elite Guarding Without Compromise.", isVisible: true, order: 4 },
  { component: "ServicesPreviewSection", title: "Our Expertise Across Sectors.", isVisible: true, order: 5 },
  { component: "TestimonialsPreviewSection", title: "What our clients say", isVisible: true, order: 6 },
  { component: "BlogsPreviewSection", title: "Latest News & Insights.", isVisible: true, order: 7 },
  { component: "CtaSection", title: "Ready to elevate your facility's security?", isVisible: true, order: 8 },
];

function SortableItem({ section, onToggle, onEditTitle }: {
  section: Section;
  onToggle: (component: string) => void;
  onEditTitle: (component: string, title: string) => void;
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(section.title || "");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.component });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-xl p-5 flex items-center gap-4 transition-all ${
        isDragging ? "shadow-2xl ring-2 ring-emerald-500" : "shadow-sm hover:shadow-md"
      } ${!section.isVisible ? "opacity-60" : ""}`}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors touch-none"
      >
        <GripVertical size={20} />
      </button>

      {/* Order Badge */}
      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black flex-shrink-0">
        {section.order}
      </div>

      {/* Section Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900 text-sm">
          {SECTION_LABELS[section.component] || section.component}
        </p>
        {isEditingTitle ? (
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              className="flex-1 text-xs border rounded px-2 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onEditTitle(section.component, titleDraft);
                  setIsEditingTitle(false);
                }
                if (e.key === "Escape") setIsEditingTitle(false);
              }}
            />
            <button
              onClick={() => { onEditTitle(section.component, titleDraft); setIsEditingTitle(false); }}
              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
            >
              <Check size={14} />
            </button>
            <button
              onClick={() => setIsEditingTitle(false)}
              className="p-1 text-slate-400 hover:bg-slate-100 rounded"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-slate-500 truncate">{section.title || "—"}</p>
            <button
              onClick={() => { setTitleDraft(section.title || ""); setIsEditingTitle(true); }}
              className="p-0.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Edit title"
            >
              <Edit size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Visibility Toggle */}
      <button
        onClick={() => onToggle(section.component)}
        className={`p-2.5 rounded-xl transition-all ${
          section.isVisible
            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            : "bg-red-50 text-red-500 hover:bg-red-100"
        }`}
        title={section.isVisible ? "Hide section" : "Show section"}
      >
        {section.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
    </div>
  );
}

export function HomepageLayoutView() {
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchLayout = async () => {
    setIsLoading(true);
    try {
      const res = await pageLayoutAPI.getByRoute("home");
      if (res.data && res.data.sections && res.data.sections.length > 0) {
        const sorted = [...res.data.sections].sort((a: Section, b: Section) => a.order - b.order);
        setSections(sorted);
      } else {
        setSections(DEFAULT_SECTIONS);
      }
    } catch {
      setSections(DEFAULT_SECTIONS);
    }
    setIsLoading(false);
    setIsDirty(false);
  };

  useEffect(() => {
    fetchLayout();
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSections((prev) => {
      const oldIndex = prev.findIndex((s) => s.component === active.id);
      const newIndex = prev.findIndex((s) => s.component === over.id);
      const newArr = arrayMove(prev, oldIndex, newIndex);
      return newArr.map((s, i) => ({ ...s, order: i + 1 }));
    });
    setIsDirty(true);
  };

  const handleToggle = (component: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.component === component ? { ...s, isVisible: !s.isVisible } : s
      )
    );
    setIsDirty(true);
  };

  const handleEditTitle = (component: string, title: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.component === component ? { ...s, title } : s
      )
    );
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await pageLayoutAPI.updateByRoute("home", { sections });
      if (res.error) {
        setMessage({ type: "error", text: res.error || "Failed to save layout" });
      } else {
        setMessage({ type: "success", text: "Homepage layout saved successfully!" });
        setIsDirty(false);
      }
    } catch {
      setMessage({ type: "error", text: "Network error — could not save." });
    }
    setIsSaving(false);
    setTimeout(() => setMessage(null), 4000);
  };

  const handleReset = () => {
    setSections(DEFAULT_SECTIONS);
    setIsDirty(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Homepage Layout</h2>
          <p className="text-sm text-slate-500 mt-1">
            Drag to reorder sections. Toggle visibility. Changes require saving.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw size={14} /> Reset Default
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className={`px-5 py-2.5 text-sm font-semibold rounded-lg flex items-center gap-2 transition-all ${
              isDirty
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-500/20"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? "Saving..." : "Save Layout"}
          </button>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
          message.type === "success"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      {/* Unsaved indicator */}
      {isDirty && (
        <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          You have unsaved changes. Click "Save Layout" to apply.
        </div>
      )}

      {/* Section List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Loading layout...</p>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.component)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {sections.map((section) => (
                <SortableItem
                  key={section.component}
                  section={section}
                  onToggle={handleToggle}
                  onEditTitle={handleEditTitle}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Info Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-4">
        <h3 className="text-sm font-bold text-slate-700 mb-2">ℹ️ How it works</h3>
        <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4 leading-relaxed">
          <li><strong>Drag</strong> sections using the grip handle to reorder them on the homepage.</li>
          <li>Use the <strong>eye toggle</strong> to show/hide sections without deleting them.</li>
          <li>Edit section <strong>titles</strong> inline — these are used for heading text where applicable.</li>
          <li>Click <strong>Save Layout</strong> to persist changes. The homepage will update on next page load.</li>
          <li><strong>Reset Default</strong> restores the original section order and visibility.</li>
        </ul>
      </div>
    </div>
  );
}
