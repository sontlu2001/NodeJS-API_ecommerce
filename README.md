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
Node:
### Có nên disConnect() liên tục hay không ?
- Không cần thiết phải đóng kết nối liên tục một cách thủ công. Vì trong mongoes sử dụng pool quản lý các CSDL tự động mở-đóng các kết nối khi cần.
- Nếu ứng dụng cần thiết phải đóng tất cả các kết nối thủ công đang hoạt động để đảm bảo dữ liệu không bị mất.
<!-- 
process.on('SIGINT',()=>{
    server.close(()=>console.log(`Exit Server Express`))
})
 -->
### PoolSize là gì ? Vì sao lại quan trọng ?
- Trong mongoose nhóm kết nối là tập hợp các kết nối tới CSDL mà có thể tái sử dụng được duy trì bởi Database (trong MySQL và oracle cũng có điều này).
- Cơ chế hoạt động của nó như sau: 
    - Khi một connection (một kết nối) được tạo, nó sẽ được đưa vào pool và sử dụng lại cho các yêu cầu kết nối tiếp theo và chỉ bị đóng khi hết thời gian timeout.Ví dụ, max pool size = 10 (số lượng tối đa connection trong pool là 10).
    - Bây giờ user kết nối tới database (truy vấn database), hệ thống sẽ kiểm tra trong connection pool có kết nối nào đang rảnh không?
    - Trường hợp chưa có kết nối nào trong connection pool hoặc tất cả các kết nối đều bận (đang được sử dụng bởi user khác) và số lượng connection trong connection < 10 thì sẽ tạo một connection mới tới database để kết nối tới database đồng thời kết nối đó sẽ được đưa vào connection pool.
    - Trường hợp tất cả các kết nối đang bận và số lượng connection trong connection pool = 10 thì người dùng phải đợi cho các user dùng xong để được dùng.
    Sau khi một kết nối được tạo và sử dụng xong nó sẽ không đóng lại mà sẽ duy trì trong connection pool để dùng lại cho lần sau và chỉ thực sự bị đóng khi hết thời gian timeout (lâu quá không dùng đến nữa)
- Việc sử dụng PoolSize giúp cải thiện hiệu suất, tăng khả năng mở rộng của ứng dụng.
### Nếu vượt quá số lượng kết nối PoolSize ?
- Mongoose sẽ không vượt quá kích thước PoolSize thay vào đó connection sẽ được đưa vào hàng đợi chờ các yêu cầu khác được xử lý xong thì mới được xử lý.
## Section 4
## Section 5: API Sign-up Shop
Install: 
- Bcrypt: Hash password
Node:
- Private key: Không lưu trên hệ thống sử dụng nó để Signing Token
- Public key: Lưu trên hệ thống sử dụng nó để Validating Token vì Public key nếu có bị để lộ ra bên ngoài nhưng không thể sign Token.
- Sử dụng hàm findOne().lean() truy vấn dữ liệu trả về Object thuần JavaScript nhẹ hơn so với Object của mongoose. 