#!/usr/bin/env bash
# Установка systemd-сервиса на VPS (Ubuntu).
# Запуск из корня репозитория на сервере, например: cd /opt/svadba && sudo bash deploy/install-systemd.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SERVICE_NAME="svadba-admin"
SERVICE_SRC="${ROOT}/deploy/${SERVICE_NAME}.service"
TARGET="/etc/systemd/system/${SERVICE_NAME}.service"

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
