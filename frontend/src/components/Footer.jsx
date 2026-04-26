const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center">
            <span className="text-background text-[11px] font-medium">R</span>
          </div>
          <span className="text-sm font-medium">Roxiler Systems</span>
        </div>
        <p className="text-[13px] text-muted-foreground">
          © {new Date().getFullYear()} Roxiler Systems. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
