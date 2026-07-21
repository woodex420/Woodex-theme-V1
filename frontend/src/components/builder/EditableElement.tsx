import React, { useRef, useCallback, type ReactNode } from 'react';
import { useBuilder } from '../../lib/builderStore';
import { styleToCss } from '../../lib/applyStyles';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

export interface EditableElementProps {
  /** Dot-notation path like "home.hero.heading" */
  path: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** If set, enables inline text editing on double-click */
  contentText?: string;
  /** If set, enables image URL editing on click */
  contentSrc?: string;
  /** If true, enables drag-and-drop reordering */
  asSection?: boolean;
  /** Badge label shown above sections in the builder */
  sectionLabel?: string;
}

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */

export default function EditableElement({
  path,
  children,
  className,
  style: passedStyle,
  contentText,
  contentSrc,
  asSection,
  sectionLabel,
}: EditableElementProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const {
    state,
    currentPage,
    selectElement,
    setHovered,
    getOverride,
    updateContent,
    reorderSection,
  } = useBuilder();

  /* ─── Read overrides for this path ──────────────────────── */
  const override = getOverride(currentPage, path);

  /* ─── Hidden: don't render at all ───────────────────────── */
  if (override?.hidden) return null;

  /* ─── Merge override styles with passed styles ──────────── */
  const overrideCss = styleToCss(override?.style);
  const mergedStyle: React.CSSProperties | undefined =
    passedStyle || Object.keys(overrideCss).length > 0
      ? { ...passedStyle, ...overrideCss }
      : undefined;

  /* ─── Content overrides ─────────────────────────────────── */
  const overrideText = override?.content?.text;
  const overrideSrc = override?.content?.src;

  /* ================================================================== */
  /*  Handlers                                                          */
  /* ================================================================== */

  /* ─── Click: select element + optional image editing ────── */
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      // Image URL editing: prompt for new URL when contentSrc is set
      if (contentSrc) {
        const currentSrc = overrideSrc || contentSrc;
        const newUrl = prompt('Enter image URL:', currentSrc);
        if (newUrl !== null && newUrl !== currentSrc) {
          updateContent(currentPage, path, { src: newUrl });
        }
        return;
      }

      selectElement(path);
    },
    [contentSrc, overrideSrc, currentPage, path, selectElement, updateContent],
  );

  /* ─── Double-click: inline text editing ─────────────────── */
  const handleDoubleClick = useCallback(() => {
    if (!contentText || !wrapperRef.current) return;

    const el = wrapperRef.current;
    el.contentEditable = 'true';
    el.focus();

    // Select all text for easy replacement
    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(el);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    /* ─── Blur handler: save and disable editing ─────────── */
    const handleBlur = () => {
      el.contentEditable = 'false';
      el.removeEventListener('blur', handleBlur);
      el.removeEventListener('keydown', handleKeydown);

      const newText = el.textContent || '';
      const currentText = overrideText || contentText;
      if (newText !== currentText) {
        updateContent(currentPage, path, { text: newText });
      }
    };

    /* ─── Keydown: Enter commits, Escape cancels ─────────── */
    const handleKeydown = (ke: KeyboardEvent) => {
      if (ke.key === 'Enter' && !ke.shiftKey) {
        ke.preventDefault();
        el.blur();
      }
      if (ke.key === 'Escape') {
        el.textContent = overrideText || contentText;
        el.blur();
      }
    };

    el.addEventListener('blur', handleBlur);
    el.addEventListener('keydown', handleKeydown);
  }, [contentText, overrideText, currentPage, path, updateContent]);

  /* ─── Mouse hover handlers ──────────────────────────────── */
  const handleMouseEnter = useCallback(() => {
    setHovered(path);
  }, [path, setHovered]);

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
  }, [setHovered]);

  /* ─── Drag-and-drop handlers ────────────────────────────── */
  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData('text/plain', path);
      e.dataTransfer.effectAllowed = 'move';

      // Add dragging class after a tick so the browser captures the drag image first
      requestAnimationFrame(() => {
        wrapperRef.current?.setAttribute('data-wpi-dragging', '');
      });
    },
    [path],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (!asSection) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      wrapperRef.current?.setAttribute('data-wpi-drop-target', '');
    },
    [asSection],
  );

  const handleDragLeave = useCallback(() => {
    wrapperRef.current?.removeAttribute('data-wpi-drop-target');
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      wrapperRef.current?.removeAttribute('data-wpi-drop-target');

      const sourcePath = e.dataTransfer.getData('text/plain');
      if (sourcePath && sourcePath !== path) {
        reorderSection(currentPage, sourcePath, path);
      }
    },
    [currentPage, path, reorderSection],
  );

  const handleDragEnd = useCallback(() => {
    wrapperRef.current?.removeAttribute('data-wpi-dragging');
    wrapperRef.current?.removeAttribute('data-wpi-drop-target');
  }, []);

  /* ================================================================== */
  /*  Render: Builder INACTIVE — zero overhead                          */
  /* ================================================================== */

  if (!state.isActive) {
    // Render children directly to preserve element types (Link, img, etc.)
    return <>{children}</>;
  }

  /* ================================================================== */
  /*  Render: Builder ACTIVE                                            */
  /* ================================================================== */

  const isSelected = state.selectedPath === path;
  // const _isHovered = state.hoveredPath === path; // kept for reference

  return (
    <div
      ref={wrapperRef}
      data-wpi-path={path}
      {...(contentText ? { 'data-wpi-text': contentText } : {})}
      {...(asSection ? { 'data-wpi-section': '' } : {})}
      {...(sectionLabel ? { 'data-wpi-label': sectionLabel } : {})}
      {...(isSelected ? { 'data-wpi-selected': '' } : {})}
      className={className}
      style={mergedStyle}
      draggable={asSection || undefined}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
    >
      {/* Render children, swapping text content if overridden */}
      {React.Children.map(children, (child) => {
        if (overrideText && React.isValidElement(child)) {
          // If child is a string/text node, replace it
          return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
            children: overrideText,
          });
        }
        if (overrideSrc && React.isValidElement(child)) {
          // If child is an img element, override src
          const tagName = (child.type as string) || '';
          if (tagName === 'img' || (typeof child.type === 'function' && (child.props as Record<string, unknown>)?.src !== undefined)) {
            return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
              src: overrideSrc,
            });
          }
        }
        return child;
      })}
    </div>
  );
}
