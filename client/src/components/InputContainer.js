import React from "react";

function InputContainer({ name, type, formData, setFormData, children }) {
  return (
    <div className="gap-2 flex flex-col">
      <label className="text-[#85929f] text-[15px]">
        {name.charAt(0).toUpperCase()}
        {name.slice(1)}
      </label>

      <div className="border-2 space-x-2 flex items-center border-[#e8ebf3] w-full rounded-md px-3 py-1.5">
        <input
          type={type}
          required
          placeholder={name}
          value={formData[name]}
          onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
          className="w-full flex-1 outline-none bg-transparent text-[14px] font-medium placeholder-[#A9A9A9]"
        />

        {children}
      </div>
    </div>
  );
}

export default InputContainer;
