"use client";
import { MouseEvent, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";

const isClickInsideRectangle = (e: MouseEvent, element: HTMLElement) => {
  const r = element.getBoundingClientRect();

  return (
    e.clientX > r.left &&
    e.clientX < r.right &&
    e.clientY > r.top &&
    e.clientY < r.bottom
  );
};

type Props = {
  isOpened: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const DialogModal = ({ isOpened, onClose, children }: Props) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpened) {
      ref.current?.showModal();
      document.body.classList.add("overflow-hidden");
    } else {
      ref.current?.close();
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpened]);

  return (
    <CSSTransition
      in={isOpened}
      appear
      timeout={150}
      classNames={{
        enter: "opacity-0 scale-75 backdrop:opacity-0",
        enterDone: "opacity-100 scale-1 backdrop:opacity-70",
        exitDone: "opacity-0 scale-75 backdrop:opacity-0",
      }}
    >
      <dialog
        className="shadow-gray-800 min-w-[90%] rounded-md bg-white p-6 text-secondary-dark shadow-md transition-all backdrop:bg-secondary backdrop:transition dark:bg-secondary-dark dark:text-zinc-200 md:min-w-[400px] md:p-8"
        ref={ref}
        onCancel={onClose}
        onClick={(e) =>
          ref.current && !isClickInsideRectangle(e, ref.current) && onClose()
        }
      >
        {children}
      </dialog>
    </CSSTransition>
  );
};

export default DialogModal;
