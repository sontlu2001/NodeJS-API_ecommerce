## Section 2:Node.js Backend Architecture
Install:
- express
- nodemon 
- morgan 
- helmet 
- compression 
## Section 3:Connect MongoDB to Node.js
Install:
- mongoose
## Section 4
## Section 5: API Sign-up Shop
Install: 
- Bcrypt: Hash password
Node:
- Private key: Không lưu trên hệ thống sử dụng nó để Signing Token
- Public key: Lưu trên hệ thống sử dụng nó để Validating Token vì Public key nếu có bị để lộ ra bên ngoài nhưng không thể sign Token.
- Sử dụng hàm findOne().lean() truy vấn dữ liệu trả về Object thuần JavaScript nhẹ hơn so với Object của mongoose. 