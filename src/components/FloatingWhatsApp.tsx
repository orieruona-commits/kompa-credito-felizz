import { MessageCircle } from "lucide-react";

export const FloatingWhatsApp = () => {
  const handleClick = () => {
    const message = encodeURIComponent("Hola tuKOMPA, necesito ayuda con mi préstamo");
    window.open(`https://wa.me/2348025626573?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 group"
      aria-label="Chat en WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute right-full mr-3 bg-white text-foreground px-4 py-2 rounded-lg shadow-lg font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        ¿Necesitas ayuda?
      </span>
    </button>
  );
};
