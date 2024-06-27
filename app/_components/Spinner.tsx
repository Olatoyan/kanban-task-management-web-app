function Spinner() {
  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center">
      <div className="loader z-10"></div>
      <div
        className="fixed bottom-0 left-0 right-0 top-0 h-full w-full bg-black/50"
        
      ></div>
    </div>
  );
}

export default Spinner;
