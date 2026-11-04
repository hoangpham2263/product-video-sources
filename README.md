# Product Video Sources

Kho cho app [Product Video](https://hoangpham.is-a.dev/product-video/).

```text
products/<nhóm>/<ảnh>   ảnh sản phẩm (.jpg .png .webp)
models/<nhóm>/<ảnh>     ảnh người mẫu
videos/<nhóm>/<video>   video (.mp4 .mov .webm)
manifest.json           tự tạo lại mỗi lần thêm/xoá file
```

Thêm ảnh: vào đúng thư mục nhóm trên GitHub, **Add file → Upload files**. Nhóm mới: gõ `products/Tên nhóm/` khi tải lên.
Ẩn một nhóm khỏi app: sửa `"enabled": false` của nhóm đó trong `manifest.json`.
