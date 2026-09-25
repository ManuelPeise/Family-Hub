using Web.Api.Bundels;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAppServices(builder.Configuration);

var app = builder.Build();

await app.Configure();

app.Run();
