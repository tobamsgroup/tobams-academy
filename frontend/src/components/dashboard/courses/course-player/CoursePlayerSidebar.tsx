import {
  ChevronDown,
  ChevronRight,
  FileText,
  MonitorPlay,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import type { PlayerLesson, PlayerModule } from "./curriculum";
import { cn } from "@/lib/utils";
import { ICONS } from "@/assets/icons";

function LessonKindIcon({ kind, className }: { kind: PlayerLesson["kind"]; className?: string }) {
  const c = cn(className);
  switch (kind) {
    case "video":
      return <ICONS.ManageVideo className={c}/>;
    case "screen":
      return <ICONS.ManageCancelVideo className={c}/>;
    case "pdf":
      return <ICONS.ManagePdf className={c}/>;
    case "quiz":
      return <ICONS.ManageFileSearch className={c}/>;
    case "assessment":
      return <ICONS.ManageFilePencil className={c}/>;
    default:
      return <ICONS.ManageFile className={c}/>;
  }
}

type CoursePlayerSidebarProps = {
  modules: PlayerModule[];
  expandedModuleIds: Set<string>;
  selectedLessonId: string;
  completedLessonIds: Set<string>;
  open: boolean;
  onToggleModule: (moduleId: string) => void;
  onSelectLesson: (lessonId: string) => void;
  onClose: () => void;
  onOpen: () => void;
};

export function CoursePlayerSidebar({
  modules,
  expandedModuleIds,
  selectedLessonId,
  completedLessonIds,
  open,
  onToggleModule,
  onSelectLesson,
  onClose,
  onOpen,
}: CoursePlayerSidebarProps) {
  const moduleProgress = (m: PlayerModule) => {
    const done = m.lessons.filter((l) => completedLessonIds.has(l.id)).length;
    return `${done}/${m.lessons.length}`;
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="flex w-10 shrink-0 flex-col items-center border-r border-[#E5E7EB] bg-white py-3 text-[#474348] hover:bg-[#F8F9FB]"
        aria-label="Open course content"
      >
        <PanelLeftOpen className="h-5 w-5" strokeWidth={2} />
      </button>
    );
  }

  return (
    <aside className="flex h-full min-h-0 w-full min-w-0 shrink-0 flex-col border-r border-[#D3D2D366] bg-white md:h-auto md:w-[401px]">
      <div className="flex items-center justify-between border-b border-[#D3D2D366] px-6 py-[30px]">
        <span className="text-[20px] font-semibold text-[#221D23]">Course Content</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1.5 text-[#474348] hover:bg-[#F0F4F8]"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto py-3">
        {modules.map((m) => {
          const isExpanded = expandedModuleIds.has(m.id);
          return (
            <div key={m.id} className="mb-1 border-b border-[#F0F0F0] pb-1 last:border-0">
              <button
                type="button"
                onClick={() => onToggleModule(m.id)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2.5 text-left text-lg font-medium text-[#221D23] hover:bg-[#F8F9FB]"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-[#6C686C]" strokeWidth={2} />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#6C686C]" strokeWidth={2} />
                )}
                <span className="min-w-0 flex-1 truncate">{m.title}</span>
                <span className="shrink-0 text-xs text-[#6C686C]">{moduleProgress(m)}</span>
              </button>
              {isExpanded && (
                <ul className="mt-0.5 space-y-0.5 pb-2">
                  {m.lessons.map((lesson) => {
                    const active = lesson.id === selectedLessonId;
                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => onSelectLesson(lesson.id)}
                          className={cn(
                            "flex w-full items-start gap-2 px-6 py-4 text-left transition-colors",
                            active
                              ? "bg-[#303869] font-medium text-white"
                              : "text-[#474348] hover:bg-[#F0F4F8]",
                          )}
                        >
                          <LessonKindIcon
                            kind={lesson.kind}
                            className={cn("mt-0.5 shrink-0", active ? "text-white" : "text-[#6C686C]")}
                          />
                          <div className="min-w-0 flex-1">
                            <span className="block leading-snug">{lesson.title}</span>
                            <p
                              className={cn(
                                "mt-1 block text-xs",
                                active ? "text-white/80" : "text-[#9CA3AF]",
                              )}
                            >
                              {lesson.durationMin}min
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
