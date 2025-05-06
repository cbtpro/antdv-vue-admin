import type { FormItem } from './FormItem';

export function collectFormModelAndRules(root: FormItem) {
  const model: Record<string, any> = {};
  const rules: Record<string, any> = {};
  const visited = new Set<FormItem>();

  function traverse(node: FormItem | null) {
    if (!node || visited.has(node)) return;
    visited.add(node);

    const { field, value, rules: ruleSet = [] } = node.payload;
    model[field] = value;
    if (ruleSet.length) rules[field] = ruleSet;

    const next = node.next(node, []);
    traverse(next);
  }

  traverse(root);
  return { model, rules };
}
