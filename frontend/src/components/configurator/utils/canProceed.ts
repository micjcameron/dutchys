import { CatalogOption, EvaluationResult, OptionGroupDTO } from "@/types/catalog";

export const canProceedGroup = ({
  groupKey,
  options,
  evaluation,
  optionGroups,
}: {
  groupKey: string;
  options: CatalogOption[];
  evaluation: EvaluationResult;
  optionGroups: OptionGroupDTO[];
}) => {
  const group = optionGroups.find((g) => g.key === groupKey);
  if (!group) return true;

  const visibleOptions = options.filter(
    (o) =>
      !evaluation.hiddenOptions[o.key] &&
      !evaluation.disabledOptions[o.key],
  );

  if (visibleOptions.length === 0) return true;

  const selected = new Set(evaluation.selectedKeys);
  const selectedCount = visibleOptions.filter((o) =>
    selected.has(o.key),
  ).length;

  if (group.selectionType === 'SINGLE') {
    return group.min ? selectedCount >= group.min : selectedCount >= 1;
  }

  if (group.selectionType === 'MULTI') {
    if (group.min && selectedCount < group.min) return false;
    if (group.max && selectedCount > group.max) return false;
    return true;
  }

  return true;
};
