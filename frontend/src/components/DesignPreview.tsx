import React from "react";
import type { AppSpec, SpecUI, SpecField } from "../types/spec";

interface DesignPreviewProps {
  spec: AppSpec;
  selectedModuleIndex?: number;
}

export const DesignPreview: React.FC<DesignPreviewProps> = ({
  spec,
  selectedModuleIndex = 0,
}) => {
  const modules = spec.modules || [];
  const currentModule = modules[selectedModuleIndex];

  if (!currentModule) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-6xl mb-4">📋</div>
        <p className="text-gray-600 text-lg">
          No modules found in specification
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {currentModule.name}
        </h2>
        <p className="text-gray-600">{currentModule.purpose}</p>
      </div>

      {/* UI Components */}
      {currentModule.ui && currentModule.ui.length > 0 ? (
        <div className="grid gap-6">
          {currentModule.ui.map((component: SpecUI, idx: number) => (
            <UIComponentPreview
              key={idx}
              component={component}
              module={currentModule}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">
            No UI components defined for this module
          </p>
        </div>
      )}
    </div>
  );
};

interface UIComponentPreviewProps {
  component: SpecUI;
  module: any;
}

const UIComponentPreview: React.FC<UIComponentPreviewProps> = ({
  component,
  module,
}) => {
  const getEntity = (entityName: string) => {
    return module.entities?.find((e: any) => e.name === entityName);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all hover:shadow-xl hover:scale-[1.01] duration-300">
      {/* Component Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">
              {component.type === "Table" ? "📊" : "📝"}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {component.name || `${component.type}: ${component.entity}`}
              </h3>
              <p className="text-sm text-gray-500">
                Entity: {component.entity}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            {component.type}
          </span>
        </div>
      </div>

      {/* Component Body */}
      <div className="p-6">
        {component.type === "Table" && (
          <TablePreview
            component={component}
            entity={getEntity(component.entity)}
          />
        )}
        {component.type === "Form" && (
          <FormPreview
            component={component}
            entity={getEntity(component.entity)}
          />
        )}
        {!["Table", "Form"].includes(component.type) && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">
              Preview not available for {component.type} component
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface TablePreviewProps {
  component: SpecUI;
  entity: any;
}

const TablePreview: React.FC<TablePreviewProps> = ({ component, entity }) => {
  const columns =
    component.columns || entity?.fields?.map((f: SpecField) => f.name) || [];

  // Generate sample data rows
  const sampleRows = 3;
  const getSampleValue = (columnName: string, rowIndex: number) => {
    const field = entity?.fields?.find((f: SpecField) => f.name === columnName);
    const type = field?.type || "string";

    switch (type) {
      case "string":
      case "text":
        return `Sample ${columnName} ${rowIndex + 1}`;
      case "email":
        return `user${rowIndex + 1}@example.com`;
      case "integer":
      case "number":
        return (rowIndex + 1) * 100;
      case "boolean":
        return rowIndex % 2 === 0 ? "Yes" : "No";
      case "date":
        return new Date().toLocaleDateString();
      case "datetime":
        return new Date().toLocaleString();
      default:
        return `Sample ${rowIndex + 1}`;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
          <tr>
            {columns.map((col: string, idx: number) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
              >
                <div className="flex items-center space-x-2">
                  <span>{col}</span>
                  {entity?.fields?.find((f: SpecField) => f.name === col)
                    ?.required && <span className="text-red-500">*</span>}
                </div>
              </th>
            ))}
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: sampleRows }).map((_, rowIdx) => (
            <tr
              key={rowIdx}
              className="hover:bg-blue-50 transition-colors duration-150"
            >
              {columns.map((col: string, colIdx: number) => (
                <td
                  key={colIdx}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                >
                  {getSampleValue(col, rowIdx)}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <div className="flex justify-end space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800 font-medium transition-colors">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Table Footer */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
        <span>Showing {sampleRows} sample rows</span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors">
            Previous
          </button>
          <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

interface FormPreviewProps {
  component: SpecUI;
  entity: any;
}

const FormPreview: React.FC<FormPreviewProps> = ({ component, entity }) => {
  const formFields = component.fields || entity?.fields || [];

  const getInputType = (fieldType: string) => {
    switch (fieldType) {
      case "email":
        return "email";
      case "number":
      case "integer":
        return "number";
      case "date":
        return "date";
      case "datetime":
        return "datetime-local";
      case "boolean":
        return "checkbox";
      default:
        return "text";
    }
  };

  const getFieldInfo = (fieldName: string) => {
    return entity?.fields?.find((f: SpecField) => f.name === fieldName);
  };

  return (
    <form className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formFields.map((field: any, idx: number) => {
          const fieldName = typeof field === "string" ? field : field.name;
          const fieldInfo = getFieldInfo(fieldName);
          const fieldType = fieldInfo?.type || field.type || "string";
          const isBoolean = fieldType === "boolean";
          const isText = fieldType === "text";

          return (
            <div key={idx} className={`${isText ? "md:col-span-2" : ""} group`}>
              <label
                htmlFor={fieldName}
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                <div className="flex items-center space-x-2">
                  <span>
                    {field.label ||
                      fieldName
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </span>
                  {(field.required || fieldInfo?.required) && (
                    <span className="text-red-500 text-base">*</span>
                  )}
                  {fieldInfo?.unique && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                      unique
                    </span>
                  )}
                </div>
              </label>

              {isBoolean ? (
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={fieldName}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all cursor-pointer"
                    disabled
                  />
                  <span className="text-sm text-gray-600">
                    {field.help_text ||
                      fieldInfo?.help_text ||
                      `Enable ${fieldName}`}
                  </span>
                </div>
              ) : isText ? (
                <textarea
                  id={fieldName}
                  rows={4}
                  placeholder={field.placeholder || `Enter ${fieldName}...`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-gray-400 resize-none"
                  disabled
                />
              ) : (
                <input
                  type={getInputType(fieldType)}
                  id={fieldName}
                  placeholder={field.placeholder || `Enter ${fieldName}...`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-gray-400"
                  disabled
                />
              )}

              {(field.help_text || fieldInfo?.help_text) && !isBoolean && (
                <p className="mt-2 text-sm text-gray-500 flex items-start space-x-1">
                  <span>💡</span>
                  <span>{field.help_text || fieldInfo?.help_text}</span>
                </p>
              )}

              {fieldInfo?.max_length && (
                <p className="mt-1 text-xs text-gray-400">
                  Max length: {fieldInfo.max_length} characters
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all shadow-sm hover:shadow"
          disabled
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          disabled
        >
          Submit
        </button>
      </div>

      {/* Form Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This is a UI preview only. Form submission is
          not implemented.
        </p>
      </div>
    </form>
  );
};
