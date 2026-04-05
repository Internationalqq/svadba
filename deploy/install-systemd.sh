#!/usr/bin/env bash
# Установка systemd-сервиса на VPS (Ubuntu).
# Из папки admin НЕ запускайте «bash deploy/...» — файла там нет. Варианты:
#   cd /opt/svadba && sudo bash deploy/install-systemd.sh
#   sudo bash /opt/svadba/deploy/install-systemd.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SERVICE_NAME="svadba-admin"
SERVICE_SRC="${ROOT}/deploy/${SERVICE_NAME}.service"
TARGET="/etc/systemd/system/${SERVICE_NAME}.service"

if [[ ! -f "${SERVICE_SRC}" ]]; then
  echo "Не найден ${SERVICE_SRC} (корень репозитория определился как ${ROOT})."
  echo "Запустите: cd /opt/svadba && sudo bash deploy/install-systemd.sh"
  exit 1
fi

if [[ "${EUID:-0}" -ne 0 ]]; then
  echo "Запустите с sudo: sudo bash deploy/install-systemd.sh"
  exit 1
fi

if [[ ! -f "${ROOT}/admin/.env" ]]; then
  echo "Нет файла ${ROOT}/admin/.env"
  echo "Создайте его: cp ${ROOT}/admin/.env.example ${ROOT}/admin/.env && nano ${ROOT}/admin/.env"
  exit 1
fi

cp -v "${SERVICE_SRC}" "${TARGET}"
systemctl daemon-reload
systemctl enable "${SERVICE_NAME}"
echo ""
echo "Готово. Команды:"
echo "  systemctl start ${SERVICE_NAME}    # запуск"
echo "  systemctl status ${SERVICE_NAME}   # статус"
echo "  journalctl -u ${SERVICE_NAME} -f   # логи"
echo ""
echo "Остановите ручной python3 server.py, если он ещё запущен в терминале: pkill -f 'python3.*server.py' || true"
echo "Затем: systemctl start ${SERVICE_NAME}"
