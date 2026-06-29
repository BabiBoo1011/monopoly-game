# 🏆 CUP GAME - CỜ TỶ PHÚ THU THẬP CÚP

Chào mừng bạn đến với **Cup Game**! Đây là một trò chơi cờ tỷ phú dạng casual board game vui nhộn, đồ họa rực rỡ, được tối ưu hóa giao diện bàn cờ 6x10 chữ nhật phủ kín 100% chức năng thực tế cực kỳ thân thiện cho trẻ em và thiết bị di động.

---

## 🎮 1. HƯỚNG DẪN CÁCH CHƠI (GAMEPLAY)

### 🎯 Mục tiêu trò chơi
Hãy tung xúc xắc, di chuyển quân cờ vương miện xung quanh viền bàn cờ và thu thập được **nhiều Cúp nhất** trước khi hết số lượt chơi!

### 🎲 Các bước chơi:
1. **Màn hình Setup**: Nhập tên của bạn tại ô **Your Name** (ví dụ: `Manh`). Chọn số lượt chơi rồi bấm **START**.
2. **Lời chào Nổi Bật**: Lời chào `Welcome Manh!` hiển thị ở phía ngoài góc trên bên trái bàn cờ.
3. **Phủ Kín 100% Ô Cờ**: Không có bất kỳ ô trắng trống nào! 100% các ô trên bàn cờ đều chứa phần thưởng cúp hoặc điểm di chuyển.
4. **Quy Tắc Nhãn Trực Quan**:
   - Ô Cúp luôn có icon Cúp `🏆` ở đầu (ví dụ: `🏆 +2`, `🏆 +5`, `🏆 -3`).
   - Ô Tiến bước luôn có mũi tên `→` (ví dụ: `→ +3`, `→ +5`) với nền màu xanh.
   - Ô Lùi bước luôn có mũi tên `←` (ví dụ: `← -3`, `← -5`) với nền màu hồng/đỏ.
5. **Logic Chuỗi Hiệu Ứng (Chain Effect)**:
   - Khi nhảy vào ô di chuyển (ví dụ `→ +5`), game hiện thông báo `Go forward 5!` và nhảy tiếp 5 bước.
   - Nếu ô tiếp theo là ô cúp (ví dụ `🏆 +3`), game tiếp tục cộng cúp và hiện thông báo `You earned 3 cups!`.

---

## 🧩 2. Ý NGHĨA CÁC Ô TRÊN BÀN CỜ (6x10 PHỦ KÍN CÚP)

Bàn cờ bao gồm **28 ô viền chữ nhật 100% có chức năng**:

| Loại Ô | Màu Sắc | Biểu Tượng Nhãn | Ý Nghĩa Chi Tiết |
| :--- | :--- | :--- | :--- |
| **Ô Xuất Phát** | 🟢 Xanh lá | 🚩 `Start` | Ô bắt đầu ván chơi. |
| **Ô Thưởng Cúp** | 🟡 Vàng / Cam | `🏆 +2`, `🏆 +3`, `🏆 +5`, `🏆 +10` | **Thưởng cúp!** Cộng ngay cúp (`You earned X cups!`). |
| **Ô Trừ Cúp** | 🔴 Đỏ hồng | `🏆 -3`, `🏆 -2` | **Cảnh báo!** Trừ cúp (`You lost X cups!`). *(Cúp không âm!)* |
| **Ô Tiến Bước** | 🔵 Xanh ngọc | `→ +3`, `→ +5` | **Tăng tốc!** Tiến thêm 3 hoặc 5 ô phía trước. |
| **Ô Lùi Bước** | 🔴 Đỏ hồng | `← -3`, `← -5` | **Sụt hố!** Lùi lại 3 hoặc 5 ô phía sau. |
| **Ô Về Xuất Phát**| 🟣 Tím | 🔄 `Home` | **Cơn lốc xoáy!** Quay lại ô **Start** (`Go to Start!`). |

---

## 🛠️ 3. HƯỚNG DẪN DÀNH CHO LẬP TRÌNH VIÊN

```bash
npm install
npm run dev
npm test
npm run build
```
