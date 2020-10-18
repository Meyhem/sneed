```sh
$ sneed service --name user
```

will create _src/Core/Services/UserService.cs_

```cs
namespace ProjectName.Core.Services
{
    public class UserService: IUserService
    {
        public UserService() { }
    }
}

```

_src/Core/Services/IUserService.cs_

```cs
namespace ProjectName.Core.Services
{
    public interface IUserService { }
}
```
