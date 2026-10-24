"""Resume o JSON do Playwright para o GitHub Actions (anotação + resumo do job)."""
import json
import os

s = json.load(open("test-results/resultados.json"))["stats"]
linha = f"{s['expected']} aprovados, {s['unexpected']} falharam, {s['flaky']} instáveis"
print(f"::notice title=Testes E2E (Playwright + axe)::{linha}")
with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as f:
    f.write(f"### Testes E2E (Playwright + axe-core): {linha}\n")
