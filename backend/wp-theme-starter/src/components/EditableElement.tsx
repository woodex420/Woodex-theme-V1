import { useState, useRef, useEffect } from "react";
import { useBuilder } from "../lib/builderStore.tsx";
import { styleToCss } from "../lib/applyStyles";
import { cn } from "../utils/cn";

type EditableProps = {
  path: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  contentText?: string;
  contentSrc?: string;
  // Mark as section (draggable / re-orderable)
  asSection?: boolean;
  sectionLabel?: string;
};

export function EditableElement({
  path,
  children,
  className = "",
  style = {},
  contentText,
  contentSrc,
  asSection = false,
  sectionLabel,
}: EditableProps) {
  const ctx = useBuilder();
  const { isAdmin, state, getSectionOverride, updateContent } = ctx;
  const ref = useRef<HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const override = isAdmin ? getSectionOverride(ctx.currentPage, path) : undefined;
  const customStyle = styleToCss(override?.style);
  const isSelected = state.selectedPath === path;
  const isHovered = state.hoveredPath === path;

  // Compose final style (custom overrides + passed-in style)
  const finalStyle: React.CSSProperties = { ...style, ...customStyle };

  if (override?.hidden) {
    return null;
  }

  const interactiveProps: Record<string, unknown> = {};

  if (isAdmin && state.isActive) {
    interactiveProps.onClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      ctx.selectElement(path);
      // If it's an image, allow inline src editing
      if (contentSrc !== undefined) {
        const newSrc = prompt("Image URL:", override?.content?.src || contentSrc || "");
        if (newSrc !== null) {
          updateContent(ctx.currentPage, path, { src: newSrc });
        }
      }
    };
    interactiveProps.onMouseEnter = (e: React.MouseEvent) => {
      e.stopPropagation();
      ctx.setHovered(path);
    };
    interactiveProps.onMouseLeave = () => {
      ctx.setHovered(null);
    };
    interactiveProps.onDoubleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      // Start inline editing for text content
      if (ref.current && (contentText !== undefined || ref.current.textContent)) {
        setIsEditing(true);
        ref.current.contentEditable = "true";
        ref.current.focus();
        // Select all
        const range = document.createRange();
        range.selectNodeContents(ref.current);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    };

    // Drag and drop for sections
    if (asSection) {
      interactiveProps.draggable = true;
      interactiveProps.onDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData("text/wpi-path", path);
        ctx.setDragged(path);
      };
      interactiveProps.onDragEnd = () => {
        ctx.setDragged(null);
        setDragOver(false);
      };
      interactiveProps.onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
      };
      interactiveProps.onDragLeave = () => setDragOver(false);
      interactiveProps.onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const fromPath = e.dataTransfer.getData("text/wpi-path");
        if (fromPath && fromPath !== path) {
          ctx.reorderSection(ctx.currentPage, fromPath, path);
        }
        setDragOver(false);
      };
    }
  }

  // Save on blur
  useEffect(() => {
    if (!isEditing || !ref.current) return;
    const el = ref.current;
    const saveOnBlur = () => {
      const newText = el.innerText || "";
      if (contentText !== undefined || true) {
        updateContent(ctx.currentPage, path, { text: newText });
      }
      el.contentEditable = "false";
      setIsEditing(false);
    };
    el.addEventListener("blur", saveOnBlur);
    return () => el.removeEventListener("blur", saveOnBlur);
  }, [isEditing, path, contentText, ctx, updateContent]);

  // Apply text content from override
  useEffect(() => {
    if (!ref.current || !isAdmin || !override?.content?.text) return;
    if (isEditing) return;
    if (ref.current.innerText !== override.content.text) {
      ref.current.innerText = override.content.text;
    }
  }, [override?.content?.text, isAdmin, isEditing]);

  // For images: apply src from override
  useEffect(() => {
    if (!ref.current || !isAdmin) return;
    if (contentSrc === undefined) return;
    const newSrc = override?.content?.src;
    if (newSrc && ref.current.getAttribute("src") !== newSrc) {
      ref.current.setAttribute("src", newSrc);
    }
  }, [override?.content?.src, isAdmin, contentSrc]);

  // Build wrapper classes
  const wrapperClasses = cn(
    isAdmin && state.isActive && "relative",
    isAdmin && state.isActive && (isSelected || isHovered) && "outline outline-2 outline-gold outline-offset-2",
    isAdmin && state.isActive && isSelected && "outline-offset-4",
    isAdmin && state.isActive && asSection && "before:absolute before:top-2 before:left-2 before:bg-gold before:text-espresso before:text-[10px] before:font-bold before:px-2 before:py-1 before:rounded before:z-10 before:uppercase before:tracking-widest",
    isAdmin && state.isActive && asSection && dragOver && "ring-4 ring-gold/40",
    isAdmin && state.isActive && asSection && `before:content-[${JSON.stringify(sectionLabel || path.split(".").slice(-2).join("."))}]`,
    className
  );

  return (
    <div
      className={wrapperClasses}
      style={{
        ...finalStyle,
        cursor: isAdmin && state.isActive ? (asSection ? "grab" : "pointer") : undefined,
      }}
      data-wpi-path={isAdmin ? path : undefined}
      {...interactiveProps}
      ref={ref as unknown as React.Ref<HTMLDivElement>}
    >
      {/* Render the content using the override or original */}
      <EditableContent override={override} contentText={contentText}>
        {children}
      </EditableContent>
    </div>
  );
}

// Helper to render children with content overrides applied
function EditableContent({
  override,
  contentText,
  children,
}: {
  override?: { content?: { text?: string; src?: string; href?: string; alt?: string } };
  contentText?: string;
  children: React.ReactNode;
}) {
  // If override exists, render override text instead
  if (override?.content?.text !== undefined && contentText !== undefined) {
    return <>{override.content.text}</>;
  }
  return <>{children}</>;
}


